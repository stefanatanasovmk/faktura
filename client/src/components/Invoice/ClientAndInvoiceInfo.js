import React, { useEffect, useState } from "react";
import "../../style/ClientAndInvoiceInfo.css"
import { Autocomplete, TextField } from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from "axios";


export default function ClientAndInvoiceInfo({ getClientAndInvoiceData, flashPopUp, fetchedInvoiceData, id }) {
     const day = new Date()
     const anotherDay = new Date()
     const defaultPaymentDay = new Date(anotherDay.setDate(anotherDay.getDate() + 90))


     const [clientName, setClientName] = useState("")
     const [address, setAddress] = useState("")
     const [tel, setTel] = useState("")
     const [email, setEmail] = useState("")
     const [invoiceNumber, setInvoiceNumber] = useState("")
     const [dateOfExecution, setDateOfExecution] = useState(day.toLocaleDateString('en-CA'))
     const [dateOfIssuing, setDateOfIssuing] = useState(day.toLocaleDateString('en-CA'))
     const [paymentDate, setPaymentDate] = useState(defaultPaymentDay.toLocaleDateString('en-CA'))

     const [savedClients, setSavedClients] = useState([])
     useEffect(() => {
          const data = { clientName, address, tel, email, invoiceNumber, dateOfExecution, dateOfIssuing, paymentDate }
          getClientAndInvoiceData(data)

     }, [clientName, address, tel, email, invoiceNumber, dateOfExecution, dateOfIssuing, paymentDate])
     useEffect(() => {
          axios.get("/api/clients")
               .then(res => setSavedClients(res.data))
               .catch(e => flashPopUp("error", e.data.response.msg))

     }, [])
     useEffect(() => {
          const selectedClient = savedClients.filter(e => e.name === clientName)
          if (selectedClient.length > 0) {
               setAddress(selectedClient[0].address)
               setTel(selectedClient[0].tel)
               setEmail(selectedClient[0].email)
          }
     }, [clientName])

     useEffect(() => {
          if (fetchedInvoiceData.clientInfo && fetchedInvoiceData.invoiceInfo) {
               const { name, tel, email, address } = fetchedInvoiceData.clientInfo
               setClientName(name)
               setTel(tel)
               setEmail(email)
               setAddress(address)
               const { invoiceNumber, executionDate, issuingDate, paymentDate } = fetchedInvoiceData.invoiceInfo
               setDateOfExecution(executionDate)
               setDateOfIssuing(issuingDate)
               setInvoiceNumber(invoiceNumber)
               setPaymentDate(paymentDate)
          }
     }, [fetchedInvoiceData])
     const clientInfoInputStyle = { margin: "5px 0px 5px 0px", width: "100%" }
     const invoiceInfoInputStyle = {
          margin: "5px 0px 5px 0px", width: "100%"
     }
     return (
          <div className="ClientAndInvoiceInfo">
               <div className="ClientInfo">
                    <Autocomplete
                         onChange={(e, val) => setClientName(val)}
                         value={clientName}
                         freeSolo
                         id="free-solo-2-demo"
                         disableClearable
                         options={savedClients.map(e => e.name)}
                         size={"small"} style={clientInfoInputStyle}
                         renderInput={(params) => (
                              <TextField type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}   {...params}
                                   placeholder="Име на клиентот"
                                   InputProps={{
                                        ...params.InputProps,
                                   }} />
                         )}
                    />
                    <TextField type="text" size={"small"} style={clientInfoInputStyle} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адреса" />
                    <TextField type="text" className="clientInfoInputs" size={"small"} style={clientInfoInputStyle} value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Телефонски број" />
                    <TextField type="text" className="clientInfoInputs" size={"small"} style={clientInfoInputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Е-маил" />

               </div>

               <div className="InvoiceInfo">
                    <TextField type="text" className="clientInfoInputs" size={"small"} style={invoiceInfoInputStyle} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="Број на фактура" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                         <MobileDatePicker
                              label="Датум на извршен промет"
                              inputFormat="dd-MM-yyyy"
                              value={dateOfExecution}
                              onChange={(e) => setDateOfExecution(e.toLocaleDateString('en-CA'))}
                              renderInput={(params) => <TextField {...params} size={"small"} style={invoiceInfoInputStyle} />}
                         />
                         <MobileDatePicker
                              label="Датум на издавање"
                              inputFormat="dd-MM-yyyy"
                              value={dateOfIssuing}
                              onChange={(e) => setDateOfIssuing(e.toLocaleDateString('en-CA'))}
                              renderInput={(params) => <TextField {...params} size={"small"} style={invoiceInfoInputStyle} />}
                         />
                         <MobileDatePicker
                              label="Рок за плаќање"
                              inputFormat="dd-MM-yyyy"
                              value={paymentDate}
                              onChange={(e) => setPaymentDate(e.toLocaleDateString('en-CA'))}
                              renderInput={(params) => <TextField {...params} size={"small"} style={invoiceInfoInputStyle} />}
                         />
                    </LocalizationProvider>

               </div>

          </div >

     )
}