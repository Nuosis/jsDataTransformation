//Here we're importing items we'll need. You can add other imports here.

window.getInvoiceRecordSUM = (json) => {
  const input = JSON.parse(json);
  console.log(input);
  const data = input.data;
  console.log(data);

  //get all customers
  const custArray = [... new Set( data.map ( obj => obj.fieldData.customerName ))].sort();

  //totalCustomerSALES
  const totalCustomerSales = data.map(function(sales) {
          if (sales.fieldData.billAmount != "") return sales.fieldData.billAmount;
          else return 0;
      });
  console.log(totalCustomerSales);
  const totalSalesSUM = totalCustomerSales.reduce(function(a, b) {
          return a + b;
      });
  console.log(totalSalesSUM);

  //totalProviderSALES
  const totalProviderSales = data.map(function(sales) {
          if (sales.fieldData.providerAmount != "") return sales.fieldData.providerAmount;
          else return 0;
      });
  console.log(totalProviderSales);
  const totalProviderSUM = totalProviderSales.reduce(function(a, b) {
          return a + b;
      });

  //totalCleanerSALES
  const totalCleanerSales = data.map(function(sales) {
          if (sales.fieldData.payAmount != "") return sales.fieldData.payAmount;
          else return 0;
      });
  console.log(totalCleanerSales);
  const totalCleanerSUM = totalCleanerSales.reduce(function(a, b) {
          return a + b;
      });
  
  //for each customer
  const result = custArray.map(function(record) {
    //get customer's records from fmData
    const custName = record;
    //console.log(custName);
    const customerRecords = data.filter(function(records) {    return records.fieldData.customerName === record});
    //console.log(customerRecords);
    const ID = customerRecords[0].fieldData._custID;
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
    const outcome = {
            custSales: `${totalSalesSUM}`,
            providerSales: `${totalProviderSUM}`,
            cleanerSales: `${totalCleanerSUM}`,
            records: JSON.stringify(result)
        };

    FileMaker.PerformScript("jsTransform . setJSResult", JSON.stringify(outcome));

};

window.getInvoiceRecordSumComparison = (json) => {
  const input = JSON.parse(json);
  //console.log(input);
  const invoiceData = input.data[1];
  //console.log(invoiceData);
  const wsData = input.data[0];
  console.log(wsData);

  //get all customers
  const custArray = [... new Set( invoiceData.map ( obj => obj.fieldData._custID ))].sort();
  
  //for each customer
  const result = custArray.map(function(record) {
    //get customer's records from fmData
    const ID = record;
    console.log(ID);
    const customerRecords = invoiceData.filter(function(records) {    return records.fieldData._custID === record});
    //console.log(customerRecords);
    const custName = customerRecords[0].fieldData.customerName;
    console.log(custName);

    //customerSALES
    const customerSales =  customerRecords.map(function(sales) {
      if (sales.fieldData.billAmount != "") {
          return sales.fieldData.billAmount
      } else {return 0};
    });
    const salesSUM = customerSales.reduce(function(a, b){
      return a + b;
    });

  // WS PROCESSING

    const wsRecords = wsData.filter(function(wsRecords) {    return wsRecords.fieldData._custID === record});
    console.log(wsRecords);

    const wsSUM = function(wsRecords) {
      if (wsRecords !== "") {
        return 0
      };

    //wsAMOUNTS
    const wsAmount =  wsRecords.map(function(sales) {
      if (sales.fieldData.savedAmountTOTAL != "") {
          return sales.fieldData.savedAmountTOTAL
      } else {return []};
    });
    console.log(wsAmount);

    const wsSUMa = wsAmount?.reduce(function(a, b){
      return a + b;
    },0);
    console.log(wsSUMa);

    return wsSUMa

    }

    const wsTOTAL = wsSUM(wsRecords)

    const obj = {name: `${custName}`, id: `${ID}`, sales: `${salesSUM}`, wsAmount: `${wsTOTAL}`};
    //console.log(obj);

    return obj;
    });

    console.log(result)

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