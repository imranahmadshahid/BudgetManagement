var names = [];
var data = [];

$(document).ready(Load);

function Load()
{
	cmbperson_dataload();
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
	if(money=='' || money===undefined || moneytxt=='' || moneytxt===undefined || selectedPerson=='' || selectedPerson=='0' || selectedPerson==undefined)
	{
		alert('Invalid Entry values');
		return;
	}
	entry = {Id:data.length,PersonId:selectedPerson, Money:money, MoneyDescription:moneytxt, status:1};
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
		html+= '<option value="'+i+1+'">'+names[i]+'</option>'
	}
	$('#cmbperson').html(html);
}

function Load_ToBePaid()
{
	var html='';
	var sum=0.0;
	for(var i = 0;i<data.length;i++)
	{
		if(data[i].status == 1)
		{
			sum+=parseFloat(data[i].Money);
			html += '<tr><td>'+data[i].Money+'</td><td>'+data[i].MoneyDescription+'</td><td><input type="button" onclick=DeleteEntry(this) value="Delete" class="btn btn-danger"/><input type="hidden" value="'+data[i].Id+'"/></td><td><input type="button" onclick=MoveToPaid(this) value="Move to Paid" class="btn btn-danger"/><input type="hidden" value="'+data[i].Id+'"/></td></tr>';
		}
	}
	html+="<tr><td><b>"+sum+"</b></td><td><b>Total Balance</b></td><td></td><td></td></tr>";
	$('#tbodyToBePaid').html(html);
}

function Load_AlreadyPaid()
{
	var html='';
	sum=0.0;
	for(var i = 0;i<data.length;i++)
	{
		if(data[i].status == 2)
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



