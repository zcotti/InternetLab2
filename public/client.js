const btn = document.getElementById("zapisatsya");

let selectedTime = ''; 
let totalMinutes = 0;


const btnTime = document.querySelectorAll(".btnfortime");
for(let button of btnTime){
  button.addEventListener('click', () => {
    selectedTime = button.textContent;
    const [hours, minutes] = selectedTime.split(':');
    totalMinutes = Number(hours) * 60 + Number(minutes);
  });
}
 
btn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phoneNumber").value;
  const services = document.getElementById("serv-select");
  const selectedValue = services.value;

  if (!selectedTime || selectedValue === 'ysl' || !phone || !name) {
    alert('Пожалуйста, заполните все данные');
    return;
  }

  const data = {
    curname: name,
    phone: phone,
    service: selectedValue,
    time: totalMinutes
  };

  try {
    const response = await fetch('/submitServices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) { 
      alert('Запись произведена успешно!'); 
    }
    else if (response.status === 409) 
      alert('Выбранное время уже занято');

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  
});

function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60); // Получаем количество часов
  const remainingMinutes = minutes % 60; // Получаем оставшиеся минуты после вычета часов

  // Формируем строку для минут с добавлением ведущего нуля при необходимости
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
  const formattedTime = `${hours}:${formattedMinutes}`; 
  
  return formattedTime;
}

async function fetchDataAndHandleButtonsColor() {
  try {
    const response = await fetch('/data');
    const data = await response.json();
    const buttons = document.querySelectorAll('.btnfortime');
    
    
  //   for (let i = 0; i < buttons.length; i++) {
  //     const button = buttons[i]; 
      
  //     let isTimeBusy = false;
      
  //     const buttonText = button.textContent;
  //     for (let j = 0; j < data.length; j++) {
  //       let a = convertMinutesToHours(data[j].starttime);
  //       if (a === buttonText) {
  //         isTimeBusy = true;
  //         break; 
  //       }
  //     }
      
  //     if (isTimeBusy) {
  //       button.style.backgroundColor = 'red';
  //     } else {
  //       button.style.backgroundColor = 'green';
  //     }
  // }


  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const buttonText = button.textContent;

    let isTimeBusy = false;

    for (let j = 0; j < data.length; j++) {
      const start = convertMinutesToHours(data[j].starttime);
      const end = convertMinutesToHours(data[j].endtime);

      const selectedTime = buttonText;

      if (selectedTime >= start && selectedTime < end) {
        isTimeBusy = true;
        break;
      }
    }

    if (isTimeBusy) {
      button.style.backgroundColor = '#777777';
    } else {
      button.style.backgroundColor = 'white';
    }
  }

  } catch (error) {
    console.error('Error:', error);
  }
}

fetchDataAndHandleButtonsColor();