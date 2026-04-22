function sendSlackNotifications() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const currentYear = today.getFullYear();


//   Ваш хук
  const slackWebhookUrl = ""
  const monthNames = {
    "Январь":0,"Февраль":1,"Март":2,"Апрель":3,"Май":4,"Июнь":5,"Июль":6,
    "Август":7,"Сентябрь":8,"Октябрь":9,"Ноябрь":10,"Декабрь":11
  };

  sheets.forEach(sh => {
    const sheetName = sh.getName();
    const match = sheetName.match(/^([А-ЯЁа-яё]+)_(\d{4})$/);
    if (!match) {
      Logger.log(`Sheet ${sheetName} → не соответствует формату Месяц_Год, пропускаем`);
      return;
    }

    let [_, monthName, sheetYear] = match;
    sheetYear = parseInt(sheetYear, 10);
    if (!(monthName in monthNames)) {
      Logger.log(`Sheet ${sheetName} → неизвестный месяц, пропускаем`);
      return;
    }

    const sheetMonth = monthNames[monthName];
    if (sheetMonth !== todayMonth || sheetYear !== currentYear) {
      Logger.log(`Sheet ${sheetName} → не текущий месяц/год, пропускаем`);
      return;
    }

    Logger.log(`Обрабатываем лист: ${sheetName}`);

    const range = sh.getDataRange();
    const values = range.getValues();
    let lastDate = null;

    for (let i = 1; i < values.length; i++) { 
      let row = values[i];
      let dateCell = row[0];

      if (!dateCell) dateCell = lastDate;

      let cellDate = null;
      if (dateCell instanceof Date) {
        cellDate = dateCell;
      } else if (typeof dateCell === "string") {
        const cleanDate = dateCell.trim();
        const parts = cleanDate.split(/[\/\.]/);
        if (parts.length >= 2) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parts.length === 3 ? parseInt(parts[2], 10) : currentYear;
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            cellDate = new Date(year, month, day);
          }
        }
      }

      if (!cellDate) continue;
      lastDate = cellDate;

      if (cellDate.getDate() !== todayDay || cellDate.getMonth() !== todayMonth) continue;

      const status = row[3]; // D
      const key = row[6]; // G
      const alreadyNotified = row[12]; // M

      if (!status || status.toString().trim().toLowerCase() !== "pre-release") continue;
      if (!key || key.toString().trim() === "") continue;
      if (alreadyNotified && alreadyNotified.toString().trim() !== "") {
        Logger.log(`Строка ${i+1}: уже уведомлено`);
        continue;
      }

    //   Ваши айди
      const provider = row[2]; // C
      const gameName = row[9]; // J
      const opsTag = "";
      const andTag = "";
      const message = `${opsTag}\nПрошу увімкнути пре-реліз *${provider}* (*${gameName}*), застосувати до нього сабнейли "Exclusive" та розмістити відповідно тасці на додавання.\nЯкщо з грою все ок - вставте, будь ласка, посилання в таблицю "New Games" стовбчик *"N"* *(Link)*. ${andTag}`;

      try {
        UrlFetchApp.fetch(slackWebhookUrl, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({ text: message })
        });
        sh.getRange(i + 1, 13).setValue("already_notified"); 
        Logger.log(`Строка ${i+1}: уведомление отправлено`);
      } catch (e) {
        Logger.log(`Строка ${i+1}: ошибка отправки Slack → ${e}`);
      }
    }
  });

  Logger.log("Скрипт завершен");
}