const nodemailer = require("nodemailer");
const Contact = require("../models/Contact.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactMail = async (req, res) => {
  const {
    name,
    email,
    country,
    phone,
    adults,
    kids,
    infants,
    arrivalDate,
    departureDate,
    message,
  } = req.body;

  if (
    !name ||
    !email ||
    !country ||
    !phone ||
    !arrivalDate ||
    !departureDate ||
    !message
  ) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // 1️⃣ Save to DB
    await Contact.create({
      name,
      email,
      country,
      phone,
      adults,
      kids,
      infants,
      arrivalDate,
      departureDate,
      message,
    });

    // 2️⃣ EMAIL CONTENT (TEXT VERSION)
    const textMessage = `
New Travel Inquiry

Name: ${name}
Email: ${email}
Country: ${country}
Phone: ${phone}

Adults: ${adults || 0}
Kids: ${kids || 0}
Infants: ${infants || 0}

Arrival Date: ${arrivalDate}
Departure Date: ${departureDate}

Message:
${message}
    `;

    // 3️⃣ EMAIL CONTENT (HTML VERSION)
    const htmlMessage = `
      <h2>New Travel Inquiry</h2>
      <hr />
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Phone:</strong> ${phone}</p>

      <h3>Travel Details</h3>
      <p><strong>Adults:</strong> ${adults || 0}</p>
      <p><strong>Kids:</strong> ${kids || 0}</p>
      <p><strong>Infants:</strong> ${infants || 0}</p>
      <p><strong>Arrival Date:</strong> ${arrivalDate}</p>
      <p><strong>Departure Date:</strong> ${departureDate}</p>

      <h3>Message</h3>
      <p>${message}</p>
    `;

    // 4️⃣ SEND EMAIL
    await transporter.sendMail({
      from: `"Travel Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Travel Inquiry",
      text: textMessage, // 🔥 IMPORTANT FIX
      html: htmlMessage,
    });

    return res.json({ message: "Contact message sent successfully" });
  } catch (error) {
    console.error("Contact mail error:", error);
    return res.status(500).json({ message: "Failed to send contact message" });
  }
};

exports.sendPlanTripMail = async (req, res) => {
  const data = req.body;

  try {
    const textMessage = `
New Trip Plan Request

Destination: ${data.destination}
Travel Dates: ${data.travelDates?.start || 'Not Set'} to ${data.travelDates?.end || 'Not Set'} (Flexible: ${data.travelDates?.flexible ? 'Yes' : 'No'})
Travelers: ${data.travelers?.adults || 0} Adults, ${data.travelers?.children || 0} Children, ${data.travelers?.infants || 0} Infants

Budget Range: ${data.budgetRange || 'Not Set'}
Accommodation: ${data.accommodationType || 'Not Set'}
Pace: ${data.travelPace || 'Not Set'}

Interests: ${(data.interests || []).join(", ") || 'None'}
Occasion: ${data.occasion || 'None'}
Dietary Requirements: ${data.dietaryReqs || 'None'}
Transport: ${data.transportPref || 'None'}
Message/Notes: ${data.message || 'None'}

Contact:
Name: ${data.fullName}
Email: ${data.email}
Phone/WhatsApp: ${data.phone || 'None'}
    `;

    const htmlMessage = `
      <h2>New Trip Plan Request</h2>
      <hr />
      <h3>Trip Details</h3>
      <p><strong>Destination:</strong> ${data.destination}</p>
      <p><strong>Dates:</strong> ${data.travelDates?.start || 'Not Set'} to ${data.travelDates?.end || 'Not Set'} <em>(Flexible: ${data.travelDates?.flexible ? 'Yes' : 'No'})</em></p>
      <p><strong>Travelers:</strong> ${data.travelers?.adults || 0} Adults, ${data.travelers?.children || 0} Children, ${data.travelers?.infants || 0} Infants</p>

      <h3>Preferences</h3>
      <p><strong>Budget Range:</strong> ${data.budgetRange || 'Not Set'}</p>
      <p><strong>Accommodation:</strong> ${data.accommodationType || 'Not Set'}</p>
      <p><strong>Travel Pace:</strong> ${data.travelPace || 'Not Set'}</p>

      <h3>Style & Extras</h3>
      <p><strong>Interests:</strong> ${(data.interests || []).join(", ") || 'None'}</p>
      <p><strong>Occasion:</strong> ${data.occasion || 'None'}</p>
      <p><strong>Dietary Requirements:</strong> ${data.dietaryReqs || 'None'}</p>
      <p><strong>Transport Preference:</strong> ${data.transportPref || 'None'}</p>
      <p><strong>Message / Notes:</strong> ${data.message || 'None'}</p>

      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone/WhatsApp:</strong> ${data.phone || 'None'}</p>
    `;

    await transporter.sendMail({
      from: `"Travel Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Trip Plan Request from ${data.fullName}`,
      text: textMessage,
      html: htmlMessage,
    });

    return res.json({ message: "Trip plan request sent successfully" });
  } catch (error) {
    console.error("Trip plan mail error:", error);
    return res.status(500).json({ message: "Failed to send trip plan details" });
  }
};
