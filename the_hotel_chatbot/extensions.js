window.PaystackExtension = {
    name: 'Payment',
    type: 'effect',
    match: ({ trace }) =>
      trace.type === 'ext_pay',
    effect: ({ trace, element }) => {
  
      console.log("Here's the email: ", trace.payload.email, trace.payload.amount)
  
      let handler = PaystackPop.setup({
        key: 'pk_test_e0f88e0ae3e2e22ccc3f6c811643127e2a9525e5', // Replace with your public key
        email: `${trace.payload.email}`,
        amount: `${trace.payload.amount}00`,
        currency: "KES",
        // label: "Optional string that replaces customer email"
        onClose: function(){
          alert('Window closed.');
        },
        callback: function(response){
          let message = 'Payment complete! Reference: ' + response.reference;
          alert(message);
          window.voiceflow.chat.interact({
            type: 'paymentComplete',
            payload: { refNo: response.reference},
          })
        }
      });
  
      handler.openIframe()
    },
  }






window.FormExtension = {
  name: "Form Extension",
	type: "response",
	match: ({trace}) => trace.type === 'form_extension',
	render: ({trace, element}) => {
    const formContainer = document.createElement('form')

    const guestIndex = trace.payload.guestIndex

    formContainer.innerHTML = `

      <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: #f0f5ff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .chatbot-container {
            width: 100%;
            max-width: 380px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0, 0, 100, 0.1);
            overflow: hidden;
            position: relative;
        }
        
        .chat-header {
            background: linear-gradient(135deg, #9B1B1E, #7A1518);
            color: white;
            padding: 18px 20px;
            display: flex;
            align-items: center;
        }
        
        .chat-icon {
            background: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        }
        
        .chat-icon svg {
            width: 18px;
            height: 18px;
            fill: #9B1B1E;
        }
        
        .chat-title {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .form-container {
            padding: 30px 25px;
        }
        
        .form-header {
            margin-bottom: 25px;
            position: relative;
            padding-bottom: 15px;
        }
        
        .form-header h1 {
            font-size: 1.4rem;
            color: #2b2d42;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .form-header p {
            color: #8d99ae;
            font-size: 0.9rem;
        }
        
        .form-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, #9B1B1E, #7A1518);
            border-radius: 3px;
        }
        
        .form-group {
            margin-bottom: 22px;
            position: relative;
        }
        
        .form-group label {
            display: block;
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 8px;
            font-weight: 500;
            letter-spacing: 0.3px;
        }
        
        .form-group input {
            width: 100%;
            padding: 14px 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #f8f9fa;
            font-size: 0.95rem;
            color: #2b2d42;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #9B1B1E;
            box-shadow: 0 0 0 3px rgba(155, 27, 30, 0.2);
            background: white;
        }
        
        .form-group input::placeholder {
            color: #adb5bd;
            font-size: 0.9rem;
        }
        
        .invalid {
            border-color: #e63946 !important;
        }
        
        .invalid + .error-message {
            display: block;
        }
        
        .error-message {
            display: none;
            color: #e63946;
            font-size: 0.75rem;
            margin-top: 6px;
        }
        
        .submit {
            background: linear-gradient(135deg, #9B1B1E, #7A1518);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 15px;
            width: 100%;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(155, 27, 30, 0.25);
            margin-top: 10px;
        }
        
        .submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(155, 27, 30, 0.35);
        }
        
        .submit:active {
            transform: translateY(0);
            box-shadow: 0 4px 12px rgba(67, 97, 238, 0.25);
        }
        
        .form-footer {
            text-align: center;
            margin-top: 25px;
            color: #8d99ae;
            font-size: 0.8rem;
        }
        
        .form-footer a {
            color: #9B1B1E;
            text-decoration: none;
        }
        
        @media (max-width: 480px) {
            .chatbot-container {
                border-radius: 12px;
            }
            
            .form-container {
                padding: 25px 20px;
            }
        }
      </style>

      <div class="chatbot-container">

        <div class="chat-header">
            <div class="chat-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                </svg>
            </div>
            <div class="chat-title">Guest Information</div>
        </div>

        <div class="form-container">

          <div class="form-header">
              <h1>Guest ${guestIndex} Details</h1>
              <p>Please provide the required information</p>
          </div>

          <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" class="name" name="name" required placeholder="Enter full name">
              <div class="error-message">Please enter a valid name</div>
          </div>

          <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" class="phone" name="phone" required pattern="\\d+" 
                      placeholder="Enter phone number" title="Invalid phone number, please enter only numbers">
              <div class="error-message">Please enter a valid phone number</div>
          </div>

          <input type="submit" class="submit" value="Submit">

          <div class="form-footer">
              We value your privacy. <a href="#">Learn more</a>
          </div>
        </div>

      </div>
    
    `

    const name = formContainer.querySelector('.name');
    // name.value = trace.payload.name

    formContainer.addEventListener('input', (e) => {
      e.preventDefault();

      const name = formContainer.querySelector('.name');
      const phone = formContainer.querySelector('.phone');


      if(name.checkValidity()) name.classList.remove('invalid');
      if(phone.checkValidity()) phone.classList.remove('invalid');
      
    })

    formContainer.addEventListener("submit", (e) => {

      e.preventDefault();

      const name = formContainer.querySelector('.name');
      const phone = formContainer.querySelector('.phone');
      

      if(!name.checkValidity()) {
        name.classList.add('invalid')
        phone.classList.add('invalid')
        return
      }

      formContainer.querySelector('.submit').remove()

      window.voiceflow.chat.interact ({
        type: "success",
        payload: {
          name: name.value,
          phone: phone.value,
        }
      })
    })

    element.appendChild(formContainer)
  },
}







window.RoomFormExtension = {
  name: "Room Form Extension",
	type: "response",
	match: ({trace}) => trace.type === 'room_form_extension',
	render: ({trace, element}) => {
    const formContainer2 = document.createElement('form')

    const tracePayload = trace.payload

    const guestRoomIndex = tracePayload.guestRoomIndex
    const guestName = tracePayload.guestName
    const roomAvailability = tracePayload.roomAvailability

    console.log(`Here are the brought in details: ${guestRoomIndex}, ${guestName}, ${roomAvailability}, ${typeof roomAvailability}`)
    console.log("Here's the payload: ", tracePayload)
    console.log("Here's the payload data type: ", typeof tracePayload)
    console.log("Here's the guest name data type: ", typeof guestName)
    console.log("Here's the room availability data type: ", typeof roomAvailability)
    console.log("Here's the guest room index data type: ", typeof guestRoomIndex)



    formContainer2.innerHTML = `

      <style>
        .chatbot-container2 {
            width: 100%;
            max-width: 380px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0, 0, 100, 0.1);
            overflow: hidden;
            position: relative;
        }
        
        .chat-header2 {
            background: linear-gradient(135deg, #9B1B1E, #7A1518);
            color: white;
            padding: 18px 20px;
            display: flex;
            align-items: center;
        }
        
        .chat-icon2 {
            background: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        }
        
        .chat-icon2 svg {
            width: 18px;
            height: 18px;
            fill: #9B1B1E;
        }
        
        .chat-title2 {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .form-container2 {
            padding: 30px 25px;
        }
        
        .form-header2 {
            margin-bottom: 25px;
            position: relative;
            padding-bottom: 15px;
        }
        
        .form-header2 h1 {
            font-size: 1.4rem;
            color: #2b2d42;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .form-header2 p {
            color: #8d99ae;
            font-size: 0.9rem;
        }
        
        .form-header2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, #9B1B1E, #7A1518);
            border-radius: 3px;
        }
        
        .form-group2 {
            margin-bottom: 22px;
            position: relative;
        }
        
        .form-group2 label {
            display: block;
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 8px;
            font-weight: 500;
            letter-spacing: 0.3px;
        }

        .form-group2 select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234361ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1em;
            width: 100%;
            padding: 1em;
            border-radius: .5em;

        }
        
        .form-group2 input {
            width: 100%;
            padding: 14px 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #f8f9fa;
            font-size: 0.95rem;
            color: #2b2d42;
            transition: all 0.3s ease;
        }
        
        .form-group2 input:focus,
        .form-group2 select:focus {
            outline: none;
            border-color: #9B1B1E;
            box-shadow: 0 0 0 3px rgba(155, 27, 30, 0.2);
            background: white;
        }
        
        .form-group2 input::placeholder {
            color: #adb5bd;
            font-size: 0.9rem;
        }
        
        .invalid {
            border-color: #e63946 !important;
        }
        
        .invalid + .error-message {
            display: block;
        }
        
        .error-message {
            display: none;
            color: #e63946;
            font-size: 0.75rem;
            margin-top: 6px;
        }
        
        .submit2 {
            background: linear-gradient(135deg, #9B1B1E, #7A1518);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 15px;
            width: 100%;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(155, 27, 30, 0.25);
            margin-top: 10px;
        }
        
        .submit2:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(155, 27, 30, 0.35);
        }
        
        .submit2:active {
            transform: translateY(0);
            box-shadow: 0 4px 12px rgba(67, 97, 238, 0.25);
        }
        
        .form-footer2 {
            text-align: center;
            margin-top: 25px;
            color: #8d99ae;
            font-size: 0.8rem;
        }
        
        .form-footer2 a {
            color: #9B1B1E;
            text-decoration: none;
        }
        
        @media (max-width: 480px) {
            .chatbot-container {
                border-radius: 12px;
            }
            
            .form-container {
                padding: 25px 20px;
            }
        }

        .room-type-info {
            background: #f0f7ff;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
            border-left: 3px solid #9B1B1E;
        }
        
        .room-type-info h4 {
            color: #9B1B1E;
            font-size: 0.9rem;
            margin-bottom: 8px;
        }
        
        .room-type-info ul {
            padding-left: 20px;
            font-size: 0.8rem;
            color: #6c757d;
        }
        
        .room-type-info li {
            margin-bottom: 4px;
        }
      </style>

      <div class="chatbot-container2">

        <div class="chat-header2">
            <div class="chat-icon2">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                </svg>
            </div>
            <div class="chat-title2">Guest Information</div>
        </div>

        <div class="form-container2">

          <div class="form-header2">
              <h1>${guestRoomIndex}. ${guestName}'s Room</h1>
              <p>Please select a room from the dropdown</p>
          </div>

          <div class="form-group2">
            <label for="roomtype">Room Type</label>
            <select id="roomtype" name="roomtype" class="roomtype" required>
                <option value="" disabled selected>Select room type</option>
                ${roomAvailability['Executive Suite'] > 0 
                  ? '<option value="Executive Suite">Executive Suite</option>' 
                  : ''}
                ${roomAvailability['Superior Room'] > 0 
                  ? '<option value="Superior Room">Superior Room</option>' 
                  : ''}
                ${roomAvailability['Junior Suite'] > 0 
                  ? '<option value="Junior Suite">Junior Suite</option>' 
                  : ''}
            </select>
            <div class="error-message">Please select a room type</div>
          </div>

          <div class="room-type-info">
              <h4>Room Features:</h4>
              <ul id="roomFeatures" class="room-features">
                  <li>Select a room type to see features</li>
              </ul>
          </div>

          <input type="submit" class="submit2" value="Submit">

          <div class="form-footer2">
              We value your privacy. <a href="#">Learn more</a>
          </div>

        </div>

      </div>
    
    `
    
    // Room type information
    const roomInfo = {
        "Executive Suite": [
            "King-size bed with premium bedding",
            "Separate living area with sofa",
            "Executive lounge access",
            "Complimentary minibar",
            "Private balcony with city view"
        ],
        "Superior Room": [
            "Queen-size bed with luxury linens",
            "Work desk with ergonomic chair",
            "Premium bathroom amenities",
            "Smart TV with streaming services",
            "Coffee/tea making facilities"
        ],
        "Junior Suite": [
            "Spacious bedroom with sitting area",
            "Marble bathroom with walk-in shower",
            "Complimentary high-speed WiFi",
            "24-hour room service",
            "Daily housekeeping and turndown service"
        ]
    };

    const roomFeatures = formContainer2.querySelector('.room-features');



    formContainer2.addEventListener('input', (e) => {
      e.preventDefault();

      const selectedRoom = formContainer2.querySelector('.roomtype').value;

      console.log("Input made: ", selectedRoom)
      console.log("Room Features UL: ", roomFeatures)

      if (selectedRoom && roomInfo[selectedRoom]) {
          roomFeatures.innerHTML = roomInfo[selectedRoom].map(feature => 
              `<li>${feature}</li>`
          ).join('');
      } else {
          roomFeatures.innerHTML = '<li>Select a room type to see features</li>';
      }
      
    })

    formContainer2.addEventListener("submit", (e) => {

      e.preventDefault();

      const roomSelected = formContainer2.querySelector('.roomtype');


      formContainer2.querySelector('.submit2').remove()

      window.voiceflow.chat.interact ({
        type: "success",
        payload: {
          roomSelected: roomSelected.value
        }
      })
    })

    element.appendChild(formContainer2)
  },
}