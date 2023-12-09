let selectedTime = ''; 
let totalMinutes = 0;

const timeService = {
  'Маникюр': 55,
  'Выщипывание бровей': 35,
  'Стрижка Мужская': 35,
  'Стрижка Женская': 55,
  'Стрижка Детская': 35,
  'Укладка волос': 55,
  'Уход за волосами': 35,
  'Депиляция воском': 75,
  'Педикюр': 115,
  'Тонирование волос': 35,
  'Бритье мужской бороды': 55,
  'Удаление гель-лака': 35,
  'Наращивание ногтей': 135,
  'Мелирование волос': 115
}



const btnTime = document.querySelectorAll(".btnfortime");
for(let button of btnTime){
  button.addEventListener('click', () => {
    selectedTime = button.textContent;
    const [hours, minutes] = selectedTime.split(':');
    totalMinutes = Number(hours) * 60 + Number(minutes);
  });
}


const btn = document.getElementById("zapisatsya");
btn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phoneNumber").value;
  const services = document.getElementById("serv-select");
  const selectedValue = services.value;

  if (!selectedTime || selectedValue === 'ysl' || !phone || !name) {
    alert('Пожалуйста, заполните все данные');
    return;
  }
  
  const duration = timeService[selectedValue];
  const totalEnd = totalMinutes + duration;

  if(!(await checkAvailability(totalMinutes, totalEnd))){
    alert('Невозможно записаться на это время, выберите другое');
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
      
      fetchDataAndHandleButtonsColor(); 
    }
    else if (response.status === 409) 
      alert('Выбранное время уже занято');

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  
});

async function checkAvailability(startmin, endmin) {
  try {
    const response = await fetch('/checkTime');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
      const slotStartTime = data[i].starttime;
      const slotEndTime = data[i].endtime;

      if (startmin < slotEndTime && endmin > slotStartTime) {
        console.log('Пересечение');
        return false; // Есть пересечение
      }
    }
    console.log('NO');
    return true; // Нет пересечений

  } catch (error) {
    console.error('Error:', error);
    return false; // В случае ошибки считаем, что есть пересечение
  }
}

function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60); 
  const remainingMinutes = minutes % 60; 

  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
  const formattedTime = `${hours}:${formattedMinutes}`; 
  
  return formattedTime;
}

async function fetchDataAndHandleButtonsColor() {
  try {
    const response = await fetch('/checkTime');
    const data = await response.json();
    const buttons = document.querySelectorAll('.btnfortime');
    
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