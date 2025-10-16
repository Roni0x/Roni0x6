document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const optionsGroup = document.getElementById('optionsGroup');
    const optionsSelect = document.getElementById('options');
    const propertiesGroup = document.getElementById('propertiesGroup');
    const propertiesCheckbox = document.getElementById('properties');
    const totalPriceElement = document.getElementById('totalPrice');
    const priceDetailsElement = document.getElementById('priceDetails');

    const basePrices = {
        regular: 50,
        general: 80,
        afterrepair: 120
    };

    const optionPrices = {
        basic: 0,
        windows: 20,
        furniture: 40
    };

    const propertyPrice = 0.5;

    let currentServiceType = 'regular';
    let currentQuantity = 50;
    let currentOption = 'basic';
    let currentProperty = false;

    function updateInterface() {
        if (currentServiceType === 'general') {
            optionsGroup.style.display = 'block';
            propertiesGroup.style.display = 'none';
        } else if (currentServiceType === 'afterrepair') {
            optionsGroup.style.display = 'none';
            propertiesGroup.style.display = 'block';
        } else {
            optionsGroup.style.display = 'none';
            propertiesGroup.style.display = 'none';
        }
    }

    function calculatePrice() {
        let basePrice = basePrices[currentServiceType];
        let optionPrice = 0;
        let propertyPriceAdd = 0;

        if (currentServiceType === 'general') {
            optionPrice = optionPrices[currentOption];
        }

        if (currentServiceType === 'afterrepair' && currentProperty) {
            propertyPriceAdd = basePrice * propertyPrice;
        }

        const pricePerMeter = basePrice + optionPrice;
        const totalPrice = (pricePerMeter + propertyPriceAdd) * currentQuantity;

        totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU');
        updatePriceDetails(basePrice, optionPrice, propertyPriceAdd, pricePerMeter, totalPrice);
    }

    function updatePriceDetails(basePrice, optionPrice, propertyPriceAdd, pricePerMeter, totalPrice) {
        let details = '';

        if (currentServiceType === 'regular') {
            details = `
                <div>Стоимость за м²: ${basePrice} руб</div>
                <div>Площадь: ${currentQuantity} м²</div>
                <div>Итого: ${basePrice} × ${currentQuantity} = ${totalPrice} руб</div>
            `;
        } else if (currentServiceType === 'general') {
            details = `
                <div>Базовая стоимость: ${basePrice} руб/м²</div>
                <div>Доп. услуга: +${optionPrice} руб/м²</div>
                <div>Итоговая ставка: ${pricePerMeter} руб/м²</div>
                <div>Площадь: ${currentQuantity} м²</div>
                <div>Итого: ${pricePerMeter} × ${currentQuantity} = ${totalPrice} руб</div>
            `;
        } else if (currentServiceType === 'afterrepair') {
            const propertyText = currentProperty ? `+${propertyPriceAdd} руб/м² (срочная)` : 'без срочности';
            details = `
                <div>Базовая стоимость: ${basePrice} руб/м²</div>
                <div>Дополнительно: ${propertyText}</div>
                <div>Итоговая ставка: ${pricePerMeter + propertyPriceAdd} руб/м²</div>
                <div>Площадь: ${currentQuantity} м²</div>
                <div>Итого: ${pricePerMeter + propertyPriceAdd} × ${currentQuantity} = ${totalPrice} руб</div>
            `;
        }

        priceDetailsElement.innerHTML = details;
    }

    quantityInput.addEventListener('input', function() {
        currentQuantity = parseInt(this.value) || 1;
        calculatePrice();
    });

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                currentServiceType = this.value;
                updateInterface();
                calculatePrice();
            }
        });
    });

    optionsSelect.addEventListener('change', function() {
        currentOption = this.value;
        calculatePrice();
    });

    propertiesCheckbox.addEventListener('change', function() {
        currentProperty = this.checked;
        calculatePrice();
    });

    updateInterface();
    calculatePrice();
});