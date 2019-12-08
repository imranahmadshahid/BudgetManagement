var names = [];
var data = [];

$(document).ready(Load);

function Load()
{
	cmbperson_dataload();
	$("#btnexport").click(btnexport_click);
	$("#btnimport").click(btnimport_click);
	$("#btnexcelimport").change(btnexcelimport_change);
	$("#cmbperson").change(cmbperson_change); 	
}


function cmbperson_change()
{
	Load_ToBePaid();
	Load_AlreadyPaid();
}

function btnimport_click()
{
	$('#btnexcelimport').click();
}

function btnexcelimport_change(e)
{
	var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function(e) {
    var d = new Uint8Array(reader.result);
    var wb = XLSX.read(d,{type:'array'});
    var htmlstr = XLSX.write(wb,{sheet:"Sheet1", type:'binary',bookType:'csv'}).replace(/[^A-Za-z0-9,.\r\n]/g, '');
	
		ProcessInput(htmlstr);
	}
}

function btnexport_click()
{
	 saveAs(new Blob([s2ab(GetData())],{type:"application/octet-stream"}), 'budgetdata.xlsx');
}

function btnaddname_click()
{
	var value = $('#txtname').val();
	if(value=='' || value===undefined)
		{
			alert('Invalid value');
			return;
		}
	names.push(value);
	$('#txtname').val('');
	cmbperson_dataload();
}
function btnaddentry_click()
{
	var money = $('#txtMoney').val();
	var moneytxt = $('#txtText').val();
	var selectedPerson = $("#cmbperson option:selected").val();
	var selecterPersonName = $("#cmbperson option:selected").text();
	if(money=='' || money===undefined || moneytxt=='' || moneytxt===undefined || selectedPerson=='' || selectedPerson=='0' || selectedPerson==undefined)
	{
		alert('Invalid Entry values');
		return;
	}
	entry = {Id:data.length,PersonId:selectedPerson,PersonName:selecterPersonName, Money:money, MoneyDescription:moneytxt, status:1};
	data.push(entry);
	Load_ToBePaid();
	Load_AlreadyPaid();
	$('#txtMoney').val('');
	$('#txtText').val('');
}

function cmbperson_dataload()
{
	var html = '<option class="text-center" value="0">-- Select Name --</option>'
	for(var i = 0;i<names.length;i++)
	{
		var id = i+1;
		html+= '<option value="'+id+'">'+names[i]+'</option>'
	}
	$('#cmbperson').html(html);
}

function Load_ToBePaid()
{
	var html='';
	var sum=0.0;
	var selectedPerson = $("#cmbperson option:selected").val();
	for(var i = 0;i<data.length;i++)
	{
		if(data[i].status == 1 && data[i].PersonId == selectedPerson)
		{
			sum+=parseFloat(data[i].Money);
			html += '<tr><td>'+data[i].Money+'</td><td>'+data[i].MoneyDescription+'</td><td><input type="button" onclick=DeleteEntry(this) value="Delete" class="btn btn-danger"/><input type="hidden" value="'+data[i].Id+'"/></td><td><input type="button" onclick=MoveToPaid(this) value="Move to Paid" class="btn btn-danger"/><input type="hidden" value="'+data[i].Id+'"/></td></tr>';
		}
	}
	html+="<tr><td><b>"+sum+"</b></td><td><b>Total Balance</b></td><td></td><td></td></tr>";
	$('#tbodyToBePaid').html(html);
}


function ProcessInput(inputString)
{
	
	var inputData = inputString.split('\n');
	if(inputData.length>0)	
		{
			data = [];
			names=[];
		}
		
	var tempNames = [];
	for(var i=0;i<inputData.length;i++)
	{
		if(inputData[i]=="" || inputData[i]==undefined)
			continue;
		var row = inputData[i].split(',');
		var entry = {Id:row[0],PersonId:row[1],PersonName:row[2], Money:row[3], MoneyDescription:row[4], status: parseInt(row[5])};
		data.push(entry);
		tempNames.push(row[2]);
	}
	
	names = Array.from(new Set(tempNames));
	
	cmbperson_dataload();
	$("#cmbperson").val(data[0].PersonId);
	Load_ToBePaid();
	Load_AlreadyPaid();
	
}

function Load_AlreadyPaid()
{
	var html='';
	sum=0.0;
	var selectedPerson = $("#cmbperson option:selected").val();
	for(var i = 0;i<data.length;i++)
	{
		if(data[i].status == 2 && data[i].PersonId == selectedPerson)
		{
			sum+=parseFloat(data[i].Money);
			html += '<tr><td>'+data[i].Money+'</td><td>'+data[i].MoneyDescription+'</td><td><input type="button" onclick=DeleteEntry(this) value="Delete" class="btn btn-danger"/><input type="hidden" value="'+data[i].Id+'"/></td><td><input type="button" onclick=MoveToUnPaid(this) value="Move to unPaid" class="btn btn-danger"/><input type="hidden" value="'+data[i].Id+'"/></td></tr>';
		}
	}
	html+="<tr><td><b>"+sum+"</b></td><td><b>Total Balance</b></td><td></td><td></td></tr>";
	$('#alreadyPaid').html(html);
}

function DeleteEntry(ref)
{
	value = parseInt($(ref).closest('td').find('input[type="hidden"]').val());
	data.splice(value,1);
	Load_AlreadyPaid();
	Load_ToBePaid();
}

function MoveToPaid(ref)
{
	value = parseInt($(ref).closest('td').find('input[type="hidden"]').val());
	for(var i = 0;i<data.length;i++)
	{
		if(data[i].Id == value)
			data[i].status = 2;
	}
	Load_AlreadyPaid();
	Load_ToBePaid();
}


function MoveToUnPaid(ref)
{
	value = parseInt($(ref).closest('td').find('input[type="hidden"]').val());
	for(var i = 0;i<data.length;i++)
	{
		if(data[i].Id == value)
			data[i].status = 1;
	}
	Load_AlreadyPaid();
	Load_ToBePaid();
}

function GetData()
{
	var wb = XLSX.utils.book_new();
	wb.Props = {
                    Title: "SheetJS",
                    Subject: "Budgeting",
                    Author: "Imran Ahmad Shahid",
                    CreatedDate: new Date(2017,12,19)
            };
	wb.SheetNames.push("Sheet1");
	var ws = XLSX.utils.aoa_to_sheet(GetArrayOfObjects());
	wb.Sheets["Sheet1"] = ws;
	var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
	return wbout;
}

function GetArrayOfObjects()
{
	//entry = {Id:data.length,PersonId:selectedPerson, Money:money, MoneyDescription:moneytxt, status:1};
	var response = [];
	for(var i=0;i<data.length;i++)
	{
		var responseItem = [];
		responseItem[0] = data[i].Id;
		responseItem[1] = data[i].PersonId;
		responseItem[2] = data[i].PersonName;
		responseItem[3] = data[i].Money;
		responseItem[4] = data[i].MoneyDescription;
		responseItem[5] = data[i].status;
		response.push(responseItem);
	}
	return response;
}

function s2ab(s) 
{ 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}



