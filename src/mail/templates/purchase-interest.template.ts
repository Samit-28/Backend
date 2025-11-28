export const purchaseInterestTemplate = (payload: any) => {
  return `
  <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    ">
      <h2 style="color: #2b2b2b; margin-top: 0;">
        📢 New Laptop Purchase Interest
      </h2>

      <p style="font-size: 15px; color: #444;">
        A user has shown interest in purchasing a laptop. Below are the details:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">User Name:</td>
          <td style="padding: 8px 0; color: #555;">${payload.userName}</td>
        </tr>

        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">User Email:</td>
          <td style="padding: 8px 0; color: #555;">${payload.userEmail}</td>
        </tr>

        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">Laptop ID:</td>
          <td style="padding: 8px 0; color: #555;">${payload.laptopId}</td>
        </tr>

        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #333;">Sale Price:</td>
          <td style="padding: 8px 0; color: #555;">${payload.salePrice}</td>
        </tr>
      </table>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #777;">
          This is an automated message — please do not reply.
        </p>
      </div>
    </div>
  </div>
  `;
};
