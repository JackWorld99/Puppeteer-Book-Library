function loadBook() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      displayBook(this);
    }
  };
  xhttp.open("GET", "http://localhost:8080/json-file");
  xhttp.send();
}

function displayBook(xhttp) {
  var display_data = document.querySelector(".container2");
  var books = JSON.parse(xhttp.responseText);

  var displayContent = "<div class='row'>";
  books.forEach(function (book) {
    displayContent += `
    <div class="image">
        <img src="${book.image}" alt="boook image">
        <div class="details1">
            <p>${book.title}</p>
            <div class="more">
                <a href="${book.web_url}" class="read-more">Read <span>More</span></a>
            </div>
        </div>
    </div>
  `;
  });
  displayContent += "</div>";
  display_data.innerHTML += displayContent;
}

function showLoading() {
  var stuff = $("#stuff").val();
  var limits = $("#limits").val();

  $.ajax({
    url: `http://localhost:8080/scrape?stuff=${stuff}&limits=${limits}`,
    dataType: "json",
    success: function (data) {
      $("#staticBackdrop").modal("hide");
      Swal.fire({
        icon: "success",
        title: "Web scraping completed!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        location.reload();
      }, 1500);
    },
  });
}
