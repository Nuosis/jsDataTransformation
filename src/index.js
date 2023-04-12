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

    const obj = {name: `${custName}`, id: `${ID}`, sales: `${salesSUM}`};
    //console.log(obj);

    return obj;
    });

    FileMaker.PerformScript("setJSResult", JSON.stringify(result));

};