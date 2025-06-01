// Используем IIFE (немедленно вызываемое функциональное выражение) для избежания глобальных переменных
(function () {
  // Получаем ссылку на поле ввода
  const inputWindow = document.getElementById("inputWindow");
  let waitingForSecondOperand = false;

  // Функция для добавления обработчиков событий для числовых кнопок
  function setupNumericButtons() {
    // Создаем массив с идентификаторами числовых кнопок
    const numericButtons = [
      "btn_0",
      "btn_1",
      "btn_2",
      "btn_3",
      "btn_4",
      "btn_5",
      "btn_6",
      "btn_7",
      "btn_8",
      "btn_9",
    ];

    // Для каждой кнопки добавляем обработчик событий
    numericButtons.forEach((buttonId) => {
      document.getElementById(buttonId).addEventListener("click", function () {
        // Получаем число, связанное с кнопкой (последний символ идентификатора)
        const number = buttonId.slice(-1);

        // Проверяем, нужно ли начать новый ввод или добавить цифру к существующему
        if (inputWindow.value === "0" || inputWindow.value === "") {
          // Если поле пустое или содержит только 0, заменяем его
          inputWindow.value = number;
        } else if (waitingForSecondOperand) {
          // Если ожидаем второй операнд, и нажата первая цифра второго операнда
          // то добавляем её к текущему выражению
          inputWindow.value += number;
          waitingForSecondOperand = false;
        } else {
          // В остальных случаях просто добавляем цифру
          inputWindow.value += number;
        }
      });
    });
  }

  // Функция для настройки кнопок операций
  function setupOperationButtons() {
    // Карта соответствия идентификаторов кнопок и операций
    const operations = {
      btn_plus: "+",
      btn_minus: "-",
      btn_mult: "*",
      btn_div: "/",
    };

    // Для каждой кнопки операции добавляем обработчик событий
    Object.keys(operations).forEach((buttonId) => {
      document.getElementById(buttonId).addEventListener("click", function () {
        const operationSymbol = operations[buttonId];

        // Если в поле уже есть операция, выполняем вычисление перед добавлением новой
        if (["+", "-", "*", "/"].some((op) => inputWindow.value.includes(op))) {
          document.getElementById("btn_calc").click();
        }

        // Добавляем операцию в поле ввода
        inputWindow.value += operationSymbol;
        waitingForSecondOperand = true;
      });
    });
  }

  // Обработчик для кнопки очистки (C)
  function setupClearButton() {
    document.getElementById("btn_clr").addEventListener("click", function () {
      inputWindow.value = "";
      waitingForSecondOperand = false;
    });
  }

  // Обработчик для кнопки вычисления (=)
  function setupCalculateButton() {
    document.getElementById("btn_calc").addEventListener("click", function () {
      try {
        // Проверяем на наличие операции в строке
        if (
          !["+", "-", "*", "/"].some((op) => inputWindow.value.includes(op))
        ) {
          return; // Если операции нет, ничего не делаем
        }

        // Проверка деления на ноль
        if (
          inputWindow.value.indexOf("/0") !== -1 &&
          !/\/0\d+/.test(inputWindow.value)
        ) {
          alert("Деление на ноль невозможно!");
          return;
        }

        // Разбиваем строку на операнды и оператор
        let firstOperand, secondOperand, operation;

        // Находим индекс оператора
        const operationIndices = ["+", "-", "*", "/"]
          .map((op) => ({
            op,
            index: inputWindow.value.indexOf(op),
          }))
          .filter((item) => item.index > 0);

        // Берем первый найденный оператор
        if (operationIndices.length > 0) {
          operationIndices.sort((a, b) => a.index - b.index);
          const opInfo = operationIndices[0];
          operation = opInfo.op;
          firstOperand = parseFloat(
            inputWindow.value.substring(0, opInfo.index)
          );
          secondOperand = parseFloat(
            inputWindow.value.substring(opInfo.index + 1)
          );
        } else {
          return; // Если операция не найдена, выходим
        }

        // Выполняем вычисление
        let result;
        switch (operation) {
          case "+":
            result = firstOperand + secondOperand;
            break;
          case "-":
            result = firstOperand - secondOperand;
            break;
          case "*":
            result = firstOperand * secondOperand;
            break;
          case "/":
            result = firstOperand / secondOperand;
            break;
        }

        // Отображаем результат
        inputWindow.value = result;
        waitingForSecondOperand = true;
      } catch (error) {
        // Обработка возможных ошибок
        console.error("Ошибка вычисления:", error);
        inputWindow.value = "Ошибка";
        waitingForSecondOperand = true;
      }
    });
  }

  // Обработчик для кнопки квадратного корня
  function setupSqrtButton() {
    document.getElementById("btn_sqrt").addEventListener("click", function () {
      const currentValue = parseFloat(inputWindow.value);

      // Проверка на отрицательное значение
      if (currentValue < 0) {
        alert("Невозможно извлечь квадратный корень из отрицательного числа!");
        return;
      }

      // Вычисляем и отображаем результат
      const result = Math.sqrt(currentValue);
      inputWindow.value = result;
      waitingForSecondOperand = true;
    });
  }

  // Функция инициализации калькулятора
  function initCalculator() {
    setupNumericButtons();
    setupOperationButtons();
    setupClearButton();
    setupCalculateButton();
    setupSqrtButton();
  }

  // Вызываем функцию инициализации при загрузке страницы
  document.addEventListener("DOMContentLoaded", initCalculator);
})();
