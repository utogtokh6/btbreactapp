//

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import css from './style.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // reCAPTCHA шалгалт
  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0 && captchaVerified) {
      // EmailJS ашиглан форм илгээх
      emailjs.sendForm('service_bcn7p6h', 'template_qeqmnaw', e.target, '2YBbHIWUzqkiaFAcU')
        .then((result) => {
          console.log('Success:', result.text);
          setIsSubmitted(true);
        })
        .catch((error) => {
          console.log('Error:', error.text);
        });
    } else {
      setErrors(validationErrors);
      if (!captchaVerified) {
        setErrors((prevErrors) => ({ ...prevErrors, captcha: 'Please verify the CAPTCHA' }));
      }
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.message) errors.message = 'Message is required';

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={css.ContactFormContainer}>
      <h2>Contact Us</h2>
      {isSubmitted ? (
        <p className={css.ThankYouMessage}>Thank you! Your message has been submitted.</p>
      ) : (
        <form onSubmit={handleSubmit} className={css.ContactForm}>
          <div className={css.FormGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name && css.ErrorInput}
            />
            {errors.name && <p className={css.ErrorMessage}>{errors.name}</p>}
          </div>

          <div className={css.FormGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email && css.ErrorInput}
            />
            {errors.email && <p className={css.ErrorMessage}>{errors.email}</p>}
          </div>

          <div className={css.FormGroup}>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message && css.ErrorInput}
            ></textarea>
            {errors.message && <p className={css.ErrorMessage}>{errors.message}</p>}
          </div>

          {/* reCAPTCHA */}
          <div className={css.FormGroup}>
            <ReCAPTCHA
              sitekey="6LcQNl8qAAAAACz-PQwKB2nVbZDGG9LoPw8wQyLp"
              onChange={handleCaptchaChange}
            />
            {errors.captcha && <p className={css.ErrorMessage}>{errors.captcha}</p>}
          </div>

          <button type="submit" className={css.SubmitButton}>Send Message</button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
