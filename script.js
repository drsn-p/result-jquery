$(document).ready(function () {
  $("#search").css("display", "none");
});

// to show main table
$(".main-table").on("click", ".save", function () {
  let arrno = $(".idno");
  let arrname = $(".fname");
  let arrsub = $(".subname");
  let arrmrks = $(".mrks");

  for (let i = 0; i < arrno.length; i++) {
    if (
      arrname.eq(i).val().trim() == "" ||
      arrsub.eq(i).val().trim() == "" ||
      arrmrks.eq(i).val() == ""
    ) {
      Swal.fire("Input can not be empty!");
      return;
    }
  }
  var htmlPart = `<thead><th>Id</th><th onclick="sort(1)" data-toggle="tooltip" title="Click to sort!">Name</th> <th onclick="sort(2)" data-toggle="tooltip"  title="Click to sort!">Subject</th>
  <th>Marks</th>
  </thead>`;
  for (let i = 0; i < arrname.length; i++) {
    if (arrname[i].parentNode.parentNode.classList.contains("activeparent")) {
      htmlPart += `<tr><td class="id">` + (i + 1) + `</td><td class="resname">` + arrname.eq(i).val() + `</td><td class="ressub">` + arrsub.eq(i).val() + `</td><td class="resmarks">` + arrmrks.eq(i).val() + `</td></tr>`;
    }
    // if (parseInt(arrmrks.eq(i).val() < 33)) {

    //   $('.resmarks').addClass("fail");
    // }
  }
    
  document.getElementById("search").style.display = "";
  $("#result").html(htmlPart);
  arrname.each((index, value)=>{ 
    let tbl = $('tbody').find('.resmarks').parent();
    if(parseInt(arrmrks.eq(index).val())<33){
      $(tbl[index]).addClass('fail');
    }
  })

    // else{
    //   tbl.addClass('bg-primary');
    // }

  // }
  perc();
});

// to count percentage
function perc() {
  let uniqname = [],
    uniqperc = [];
  var totalsub = 0;
  let arrname = $(".fname");
  let marks = $(".mrks");
  for (let i = 0; i < arrname.length; i++) {
    var flag = 0,
      mark = 0;
    for (let j = 0; j < uniqname.length; j++) {
      if (arrname.eq(i).val() == uniqname[j]) {
        flag = 1;
        break;
      }
    }
    if (flag) {
      continue;
    }
    totalsub++;
    totalsub = 1;
    uniqname.push(arrname.eq(i).val());
    mark = parseFloat(marks.eq(i).val());
    for (let j = i + 1; j < arrname.length; j++) {
      if (arrname.eq(i).val() == arrname.eq(j).val()) {
        mark += parseInt(marks.eq(j).val());
        totalsub++;
      }
    }
    uniqperc.push((mark / (totalsub * 100)) * 100).toFixed(2);
  }

  var perchtml = `<thead><th>Id</th>
  <th>Name</th>
  <th>Percentage</th>
  </thead>`;

  for (let x = 0; x < uniqname.length; x++) {
    if (arrname[x].parentNode.parentNode.classList.contains("activeparent")) {
      perchtml +=
        `<tr><td>` + (x + 1) + `</td><td>` + uniqname[x] + `</td><td class="uniqperc">` + uniqperc[x]  + `</td></tr>`;
    }
  }
  $("#perc").html(perchtml);
}

// to change the color onclik of pass btn
$("tbody").on("click", ".btnpass", function () {
  $(this).addClass("activepass");
  $(this).next().removeClass("activefail");
  $(this).closest("tr").addClass("activeparent");
});
// to change the color onclik of fail btn
$("tbody").on("click", ".btnfail", function () {
  $(this).addClass("activefail");
  $(this).prev().removeClass("activepass");
  $(this).closest("tr").removeClass("activeparent");
});

$(".addbtn").click(function () {
  var addhtml = "";
  addhtml += `<tr><td class="idno" id="idno" data-title="Id"></td><td data-title="Name"><input type="text" class="fname valid" autocomplete="off"/></td><td data-title="Subject"><input type="text" class="subname valid" autocomplete="off"/></td> <td data-title="Marks"><input type="number" class="mrks" max="100" autocomplete="off" onkeydown="return event.keyCode !== 69" id="mrks" /></td><td><button class="btnpass bn1" type="button" onclick="onclickpass(this)"> pass </button><button class="btnfail bn1" type="button">fail</button></td><td><button class="remove bn1" type="button">remove</button></td></tr>`;
  $("#myTable").append(addhtml);
});

$("tbody").on("click", '.remove', function () {
  Swal.fire({
    title: "Are you sure to remove?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, remove it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $(this).parentsUntil('tbody').remove();
    }
  });
});

$("tbody").on("change", '.mrks', function () {
  let val = parseInt($(this).val())
  if (val < 0 || val > 100) {
    swal("Oops", "Enter Value Between 0 To 100 Only", "error");
    $(this).val("");
  }
});
// allow only letters
$("tbody").on("change", '.valid', function () {
  let letters = /^[A-Za-z ]+$/;
  let valu = $(this).val();
  if (!valu.match(letters)) {
    swal("Oops", "Please Enter Letters Only", "error");
    $(this).val("");
  }
});

// search in result table 
$("#searchInput").on("keyup", function() {
  var text = $(this).val().toLowerCase();
  $("#result tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(text) > -1)
  });
});

// sorting by name and subject
function sort(n) {
  let table, rows, swch, i, x, y, exchange, direction, count = 0;
  table = document.getElementById("result");
  swch = true;
  direction = "asc";
  while (swch) {
    swch = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      exchange = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (direction == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          exchange = true;
          break;
        }
      } else if (direction == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          exchange = true;
          break;
        }
      }
    }
    if (exchange) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      swch = true;
      count++;
    } else {
      if (count == 0 && direction == "asc") {
        direction = "desc";
        swch = true;
      }
    }
  }
}


