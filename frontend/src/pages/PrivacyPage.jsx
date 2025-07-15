import "../styles/PrivacyPage.css";

const PrivacyPage = () => {
  return (
    <main className="privacy-page">
      <h1>Privacy Policy</h1>
      <p>
        Effective Date: 7/15/2025
        <br />
        We value your privacy. This Privacy Policy explains how our application
        collects, uses, and safeguards data for users using Google Sign-in.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>
          Google Access Token: We store your Google access token to enable
          access to your email (readonly) and calendar events (create, read,
          edit, delete). This token is required for the app to function and can
          be revoked by you at any time via your Google account settings.
        </li>
        <li>
          Personal Information: We collect and store your name and email address
          to personalize your experience and identify your account.
        </li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>
          To access your Google email and calendar events as authorized by you.
        </li>
        <li>
          Emails are only used to identify interview dates to add to your
          application list, and no further information is retained.
        </li>
        <li>
          Calendar access is used to add upcoming interviews to your calendar -
          this is optional and only done on confirmation.
        </li>
        <li>To provide and improve the functionality of the application.</li>
        <li>To communicate with you regarding your account and app updates.</li>
      </ul>
      <h2>Data Security</h2>
      <p>
        We implement appropriate security measures to protect your access token
        and personal information from unauthorized access, disclosure, or
        misuse.
      </p>
      <h2>Your Control and Choices</h2>
      <p>
        You can revoke the app’s access to your Google account at any time
        through your Google account permissions. You may request deletion of
        your personal information by contacting us.
      </p>
      <h2>Data Retention</h2>
      <p>
        We retain your access token and personal information only as long as
        necessary to provide the service or comply with legal obligations.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns, please contact us at
        appliq.tracker@gmail.com.
      </p>
    </main>
  );
};

export default PrivacyPage;
