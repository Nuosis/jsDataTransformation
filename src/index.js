//Here we're importing items we'll need. You can add other imports here.

window.getInvoiceRecordSUM = (json) => {
  const data = JSON.parse(json);
  console.log(data);

  //get all customers
  const custArray = [... new Set( data.map ( obj => obj.fieldData.customerName ))].sort();
  
  //for each customer
  const result = custArray.map(function(record) {
    //get customer's records from fmData
    const custName = record;
    //console.log(custName);
    const customerRecords = data.filter(function(records) {    return records.fieldData.customerName === record});
    //console.log(customerRecords);
    const ID = customerRecords[0].fieldData.__ID;
    //console.log(ID);

    //cleanerSALES
    const cleanerSales =  customerRecords.map(function(cleaner) {
      if (cleaner.fieldData.payAmount != "") {
          return cleaner.fieldData.payAmount
      } else {return 0};
    });
    //console.log(cleanerSales);
    const cleanerSUM = cleanerSales.reduce(function(a, b){
      return a + b;
    });
    //console.log(cleanerSUM);

    //providerSALES
    const providerSales =  customerRecords.map(function(provider) {
        if (provider.fieldData.providerAmount != "") {
            return provider.fieldData.providerAmount
        } else {return 0};
    });
    //console.log(providerSales);
    const providerSUM = providerSales.reduce(function(a, b){
        return a + b;
    });
    //console.log(providerSUM);

    //customerSALES
    const customerSales =  customerRecords.map(function(sales) {
      if (sales.fieldData.billAmount != "") {
          return sales.fieldData.billAmount
      } else {return 0};
    });
    //console.log(customerSales);
    const salesSUM = customerSales.reduce(function(a, b){
      return a + b;
    });
  //console.log(salesSUM);

    const obj = {name: `${custName}`, id: `${ID}`, sales: `${salesSUM}`, providerPay: `${providerSUM}`, cleanerPay: `${cleanerSUM}`};
    //console.log(obj);

    return obj;
    });

    FileMaker.PerformScript("jsTransform . setJSResult", JSON.stringify(result));

};

window.getSpecifiedInvoiceRecords = (json) => {
  const input = JSON.parse(json);
  //console.log(input);
  const custID = input.id;
  console.log(custID);
  const data = input.data;
  //console.log(data);

  //get customer's records from fmData
  const customerRecords = data.filter(function(records) {    return records.fieldData._custID === custID});
  console.log(customerRecords);
  
  const invoiceIDS =  customerRecords.map(function(record) {
    return record.fieldData.__ID
  });

  FileMaker.PerformScript("jsTransform . setJSResult", JSON.stringify(invoiceIDS));

};