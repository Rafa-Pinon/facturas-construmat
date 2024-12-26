import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "./logo/logo.png";
import "./App.css";

function App() {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    date: "",
    items: [{ description: "", quantity: 1, price: 0 }],
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("item-")) {
      const items = [...invoiceData.items];
      items[index][name.split("-")[1]] = value;
      setInvoiceData({ ...invoiceData, items });
    } else {
      setInvoiceData({ ...invoiceData, [name]: value });
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => {
      const itemTotal = parseFloat(item.quantity) * parseFloat(item.price);
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  const generatePDF = () => {
    const input = document.getElementById("invoice");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div className="app-container">
      <h1 className="title">FACTURAS CONSTRUMAT</h1>
      <form className="form-container">
        <div className="form-group">
          <label>Nombre del Cliente:</label>
          <input
            type="text"
            name="customerName"
            value={invoiceData.customerName}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label>Nombre del Trabajo:</label>
          <input
            type="text"
            name="customerTrabajo"
            value={invoiceData.customerTrabajo}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            name="date"
            value={invoiceData.date}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <h3 className="subtitle">Concepto</h3>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="item-group">
            <input
              type="text"
              name="item-description"
              placeholder="Descripción"
              value={item.description}
              onChange={(e) => handleInputChange(e, index)}
            />
            <input
              type="number"
              name="item-quantity"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, index)}
            />
            <input
              type="number"
              name="item-price"
              placeholder="Precio"
              value={item.price}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        ))}
        <button type="button" onClick={addItem} className="btn btn-add">
          Añadir Ítem
        </button>
      </form>

      <div id="invoice" className="invoice-container">
        <div className="logo">
          <h2>Factura</h2>
          <img src={Logo} alt="" />
        </div>

        <p>Cliente: {invoiceData.customerName}</p>
        <p>Trabajo: {invoiceData.customerTrabajo}</p>
        <p>Fecha: {invoiceData.date}</p>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.quantity * item.price || 0}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="3"
                style={{ fontWeight: "bold", textAlign: "right" }}
              >
                Total General:
              </td>
              <td style={{ fontWeight: "bold" }}>
                {calculateTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button onClick={generatePDF} className="btn btn-generate">
        Generar PDF
      </button>
    </div>
  );
}

export default App;
