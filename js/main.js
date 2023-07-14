$(document).ready(() => {
  let items = [];
  const container = $(".scrollaa");
  const buttonleft = $("#scroll-left");
  const buttonright = $("#scroll-right");
  const scrollcard = $(".scrollcard");
  const btnlaptop = $("#btnlaptop");
  const btnheadset = $("#btnheadset");
  const btnear = $("#btnear");
  const btnall = $("#btnall");
  let itemsincartid = [];
  let selectedItemId = [];
  let totalvalue;
  let Delivery = 0;
  let discount = 0;
  let couponInput = $(".coupon");
  const renderItems = async () => {
    $.ajax({
      url: "http://localhost:3000/items",
      type: "GET",
      dataType: "json",
      success: function (res) {
        items = res;
        run();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("GET request failed");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  };

  renderItems();
  const putintocart = async (event) => {
    for (let i = 0; i < selectedItemId.length; i++) {
      const itemId = selectedItemId[i];
      const item = items.find((item) => item.id === itemId);
      if (item.count >= 1) {
        itemsincartid.push(item.id);
      }
    }
    let currentDate = new Date();
    const doc = {
      itemsid: itemsincartid,
      count: items.count,
      total: totalvalue + Delivery - adddiscount,
      date: currentDate,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/purchase",
      data: JSON.stringify(doc),
      contentType: "application/json",
      success: function (response) {
        console.log("POST request successful");
        console.log(response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("POST request failed");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  };
  $(".btncontinue").on("click", () => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: false,
    }).then((willDelete) => {
      if (willDelete) {
        if (totalvalue > 0) {
          swal({
            title: "Purchase!",
            text: "Purchase Successfully!",
            icon: "success",
            button: "Done",
          }).then(() => {

            putintocart(event);
            $(".scrollcardview1").empty();
            for (let i = 0; i < items.length; i++) {
              items[i].count = 0;
            }
            $(".subtotal").text("");
            $(".Delivery").text("");
            $(".Discount").text("");
            $(".totalaa").text("");
            couponInput.val("");
            $(".couponstatsuc").hide();
            $(".unsuc").hide();
            $(".scrollcardview1").removeClass("scroll");
          });
        } else {
          swal({
            title: "Purchase!",
            text: "Purchase Unsuccessfully!",
            icon: "error",
            button: "Back",
          });
        }
      } else {
        swal({
          title: "Purchase!",
          text: "Purchase Unsuccessfully!",
          icon: "error",
          button: "Back",
        });
      }
    });
  });
  async function run() {
    $("#navbar-button").on("click", function () {
      $("#navbar-links").toggle();
    });
    couponInput.on("input", () => {
      const couponValue = couponInput.val();
      if (couponValue.length > 0) {
        if (couponValue === "admin") {
          discount = 5;
          $(".unsuc").hide();
          $(".couponstatsuc").show();
        } else {
          discount = 0;
          $(".couponstatsuc").hide();
          $(".unsuc").show();
        }
      } else {
        $(".couponstatsuc").hide();
        $(".unsuc").hide();
      }

      total();
    });
    function total() {
      totalvalue = 0;
      for (let i = 0; i < selectedItemId.length; i++) {
        const itemId = selectedItemId[i];
        const item = items.find((item) => item.id === itemId);
        let value = item.price * item.count;
        totalvalue += value;
      }
      adddiscount = (totalvalue * discount) / 100;
      $(".subtotal").text(totalvalue + "$");
      $(".Delivery").text("0$");
      $(".Discount").text(discount + "%");
      $(".totalaa").text(totalvalue + Delivery - adddiscount + "$");
    }
    function additem() {
      for (let i = 0; i < items.length; i++) {
        const scrollitem = $("<div>").addClass("scrollitem");
        scrollcard.append(scrollitem);

        const card = $("<div>").addClass("card");
        scrollitem.append(card);

        const cardimage = $("<img>")
          .addClass("card-img-top")
          .attr("src", items[i].image);
        card.append(cardimage);

        const cardimageoverlay = $("<div>").addClass("");
        card.append(cardimageoverlay);

        const cardimageoverlaybtn = $("<button>")
          .addClass("btn btn-black")
          .text("Free Shipping");
        cardimageoverlay.append(cardimageoverlaybtn);
        cardimageoverlaybtn.on("click", function () {
          const index = $(this).parents(".scrollitem").index();
          items[i].view = false;
          items[i].view = true;
          items[i].count = items[i].count + 1;
          const itemId = items[i].id;

          const itemIndex = selectedItemId.indexOf(itemId);
          if (itemIndex !== -1) {
            selectedItemId.splice(itemIndex, 1);
          }
          selectedItemId.push(itemId);
          additemview();
          addtocart();
          total();
        });

        const bottomcard = $("<div>").addClass("bottom-card");
        scrollitem.append(bottomcard);

        const titleprice = $("<div>").addClass("titleprice");
        bottomcard.append(titleprice);

        const row = $("<div>").addClass("row");
        titleprice.append(row);

        const colsm61 = $("<div>").addClass("col-sm-8");
        row.append(colsm61);

        const titletext = $("<h1>").addClass("title-text").text(items[i].title);
        colsm61.append(titletext);

        const colsm62 = $("<div>").addClass("col-sm-4");
        row.append(colsm62);

        const price = $("<h1>")
          .addClass("price")
          .text(items[i].price + "$");
        colsm62.append(price);

        const bttext = $("<p>")
          .addClass("bottom-text")
          .text(items[i].description);
        bottomcard.append(bttext);


      }
    }
    additem();
    function additemwithtype(producttype) {
      for (let i = 0; i < items.length; i++) {
        if (producttype === items[i].producttype) {
          const scrollitem = $("<div>").addClass("scrollitem");
          scrollcard.append(scrollitem);

          const card = $("<div>").addClass("card");
          scrollitem.append(card);

          const cardimage = $("<img>")
            .addClass("card-img-top")
            .attr("src", items[i].image);
          card.append(cardimage);

          const cardimageoverlay = $("<div>").addClass("");
          card.append(cardimageoverlay);

          const cardimageoverlaybtn = $("<button>")
            .addClass("btn btn-black")
            .text("Free Shipping");
          cardimageoverlay.append(cardimageoverlaybtn);
          cardimageoverlaybtn.on("click", function () {
            const index = $(this).parents(".scrollitem").index();
            items[i].view = false;
            items[i].view = true;
            items[i].count = items[i].count + 1;
            const itemId = items[i].id;

            const itemIndex = selectedItemId.indexOf(itemId);
            if (itemIndex !== -1) {
              selectedItemId.splice(itemIndex, 1);
            }
            selectedItemId.push(itemId);
            additemview();
            addtocart();
            total();
          });

          const bottomcard = $("<div>").addClass("bottom-card");
          scrollitem.append(bottomcard);

          const titleprice = $("<div>").addClass("titleprice");
          bottomcard.append(titleprice);

          const row = $("<div>").addClass("row");
          titleprice.append(row);

          const colsm61 = $("<div>").addClass("col-sm-8");
          row.append(colsm61);

          const titletext = $("<h1>").addClass("title-text").text(items[i].title);
          colsm61.append(titletext);

          const colsm62 = $("<div>").addClass("col-sm-4");
          row.append(colsm62);

          const price = $("<h1>")
            .addClass("price")
            .text(items[i].price + "$");
          colsm62.append(price);

          const bttext = $("<p>")
            .addClass("bottom-text")
            .text(items[i].description);
          bottomcard.append(bttext);
        }
      }
    }
    additem();
    function addtocart() {
      $(".scrollcardview1").empty();
      for (let i = 0; i < selectedItemId.length; i++) {
        const itemId = selectedItemId[i];
        const item = items.find((item) => item.id === itemId);
        if (item.count >= 1) {
          const row2 = $("<div>").addClass("row2");
          $(".scrollcardview1").append(row2);
          const col4 = $("<div>").addClass("col-sm-4");
          row2.append(col4);
          const image = $("<img>").addClass("cart-img").attr("src", item.image); // use item variable instead of items[i]
          col4.append(image);
          const col8 = $("<div>").addClass("col-sm-8");
          row2.append(col8);
          const carttitleprice = $("<div>").addClass("carttitleprice");
          col8.append(carttitleprice);
          const titletext = $("<div>").addClass("title-text").text(item.title);
          carttitleprice.append(titletext);
          const cardtext = $("<div>")
            .addClass("card-text")
            .text(item.description);
          carttitleprice.append(cardtext);
          const row1 = $("<div>").addClass("row");
          carttitleprice.append(row1);
          const cartprice = $("<div>")
            .addClass("col-sm-5 cart-price")
            .text(item.price + "$");
          row1.append(cartprice);
          const col21 = $("<div>").addClass("col-sm-2");
          row1.append(col21);
          const btnminus = $("<button>")
            .addClass("cart-btn-minus")
            .html('<i class="fa fa-minus"></i>');
          col21.append(btnminus);
          btnminus.on("click", () => {
            item.count = item.count - 1;
            cartcount.text(item.count);
            if (item.count < 1) {
              row.remove();
            }
            if (item.count < 0) {
              item.count = 0;
            }
            total();
          });
          const col23 = $("<div>").addClass("col-sm-2");
          row1.append(col23);
          const cartcount = $("<div>").addClass("cart-count").text(item.count);
          col23.append(cartcount);
          col21.append(btnminus);
          const col22 = $("<div>").addClass("col-sm-2");
          row1.append(col22);
          const btnplus = $("<button>")
            .addClass("cart-btn-add")
            .html('<i class="fa fa-plus"></i>');
          col22.append(btnplus);
          btnplus.on("click", () => {
            item.count = item.count + 1;
            console.log(item.count);
            cartcount.text(item.count);
            total();
          });
          const hr = $("<hr>");
          row.append(hr);
          const card = $("<div>").addClass("card");
          scrollitem.append(card);

          const cardimage = $("<img>")
            .addClass("card-img-top")
            .attr("src", items[i].image);
          card.append(cardimage);

          const cardimageoverlay = $("<div>").addClass("");
          card.append(cardimageoverlay);

          const cardimageoverlaybtn = $("<button>")
            .addClass("btn btn-black")
            .text("Free Shipping");
          cardimageoverlay.append(cardimageoverlaybtn);
          cardimageoverlaybtn.on("click", function () {
            const index = $(this).parents(".scrollitem").index();
            items[i].view = false;
            items[i].view = true;
            items[i].count = items[i].count + 1;
            const itemId = items[i].id;

            const itemIndex = selectedItemId.indexOf(itemId);
            if (itemIndex !== -1) {
              selectedItemId.splice(itemIndex, 1);
            }
            selectedItemId.push(itemId);
            additemview();
            addtocart();
            total();
          });

          const bottomcard = $("<div>").addClass("bottom-card");
          scrollitem.append(bottomcard);

          const titleprice = $("<div>").addClass("titleprice");
          bottomcard.append(titleprice);

          const row = $("<div>").addClass("row");
          titleprice.append(row);

          const colsm61 = $("<div>").addClass("col-sm-8");
          row.append(colsm61);

          const aia = $("<h1>").addClass("title-text").text(items[i].title);
          colsm61.append(aia);

          const colsm62 = $("<div>").addClass("col-sm-4");
          row.append(colsm62);

          const price = $("<h1>")
            .addClass("price")
            .text(items[i].price + "$");
          colsm62.append(price);

          const bttext = $("<p>")
            .addClass("bottom-text")
            .text(items[i].description);
          bottomcard.append(bttext);
        }
      }
    }
    function additemwithtype(producttype) {
      for (let i = 0; i < items.length; i++) {
        if (producttype === items[i].producttype) {
          const scrollitem = $("<div>").addClass("scrollitem");
          scrollcard.append(scrollitem);

          const card = $("<div>").addClass("card");
          scrollitem.append(card);

          const cardimage = $("<img>")
            .addClass("card-img-top")
            .attr("src", items[i].image);
          card.append(cardimage);

          const cardimageoverlay = $("<div>").addClass("");
          card.append(cardimageoverlay);

          const cardimageoverlaybtn = $("<button>")
            .addClass("btn btn-black")
            .text("Free Shipping");
          cardimageoverlay.append(cardimageoverlaybtn);
          cardimageoverlaybtn.on("click", function () {
            const index = $(this).parents(".scrollitem").index();
            items[i].view = false;
            items[i].view = true;
            items[i].count = items[i].count + 1;
            const itemId = items[i].id;

            const itemIndex = selectedItemId.indexOf(itemId);
            if (itemIndex !== -1) {
              selectedItemId.splice(itemIndex, 1);
            }
            selectedItemId.push(itemId);
            additemview();
            addtocart();
            total();
          });

          const bottomcard = $("<div>").addClass("bottom-card");
          scrollitem.append(bottomcard);

          const titleprice = $("<div>").addClass("titleprice");
          bottomcard.append(titleprice);

          const row = $("<div>").addClass("row");
          titleprice.append(row);

          const colsm61 = $("<div>").addClass("col-sm-8");
          row.append(colsm61);

          const titletext = $("<h1>")
            .addClass("title-text")
            .text(items[i].title);
          colsm61.append(titletext);

          const colsm62 = $("<div>").addClass("col-sm-4");
          row.append(colsm62);

          const price = $("<h1>")
            .addClass("price")
            .text(items[i].price + "$");
          colsm62.append(price);

          const bttext = $("<p>")
            .addClass("bottom-text")
            .text(items[i].description);
          bottomcard.append(bttext);

        }
      }
    }

    buttonleft.on("click", () => {
      container.animate({ scrollLeft: "-=300px" }, 100);
    });

    buttonright.on("click", () => {
      container.animate({ scrollLeft: "+=300px" }, 100);
    });
    $(".fa-heart").on("click", function () {
      $(this).toggleClass("background-heart");
    });

    // Get the search input field
    let searchInput = $('input[type="search"]');

    // Add an event listener to the search input field
    searchInput.on("input", function () {
      // Get the search query
      let query = $(this).val().toLowerCase();

      // Iterate over the items and hide/show them based on whether their text matches the search query
      for (let i = 0; i < items.length; i++) {
        let item = $(".scrollcard").eq(i);
        let text = items[i].title.toLowerCase();
        console.log(text);
        if (text.indexOf(query) === -1) {
          $(item).hide();
        } else {
          $(item).show();
        }
      }
    });
    btnlaptop.on("click", () => {
      scrollcard.empty();
      additemwithtype("Laptop");
    });
    btnheadset.on("click", () => {
      scrollcard.empty();
      additemwithtype("Headphone");
    });
    btnear.on("click", () => {
      scrollcard.empty();
      additemwithtype("Earphone");
    });
    btnall.on("click", () => {
      scrollcard.empty();
      additem();
    });

    function addtocart() {
      $(".scrollcardview1").empty();
      for (let i = 0; i < selectedItemId.length; i++) {
        const itemId = selectedItemId[i];
        const item = items.find((item) => item.id === itemId);
        if (item.count >= 1) {
          const row = $("<div>").addClass("row");
          $(".scrollcardview1").append(row);
          const col4 = $("<div>").addClass("col-sm-4");
          row.append(col4);
          const image = $("<img>").addClass("cart-img").attr("src", item.image);
          col4.append(image);
          const col8 = $("<div>").addClass("col-sm-8");
          row.append(col8);
          const carttitleprice = $("<div>").addClass("carttitleprice");
          col8.append(carttitleprice);
          const titletext = $("<div>").addClass("title-text").text(item.title);
          carttitleprice.append(titletext);
          const cardtext = $("<div>")
            .addClass("card-text")
            .text(item.description);
          carttitleprice.append(cardtext);
          const row1 = $("<div>").addClass("row");
          carttitleprice.append(row1);
          const cartprice = $("<div>")
            .addClass("col-sm-5 cart-price")
            .text(item.price + "$");
          row1.append(cartprice);
          const col21 = $("<div>").addClass("col-sm-2");
          row1.append(col21);
          const btnminus = $("<button>")
            .addClass("cart-btn-minus")
            .html('<i class="fa fa-minus"></i>');
          col21.append(btnminus);
          btnminus.on("click", () => {
            item.count = item.count - 1;
            cartcount.text(item.count);
            if (item.count < 1) {
              row.remove();
            }
            if (item.count < 0) {
              item.count = 0;
            }
            total();
          });
          const col23 = $("<div>").addClass("col-sm-2");
          row1.append(col23);
          const cartcount = $("<div>").addClass("cart-count").text(item.count);
          col23.append(cartcount);
          col21.append(btnminus);
          const col22 = $("<div>").addClass("col-sm-2");
          row1.append(col22);
          const btnplus = $("<button>")
            .addClass("cart-btn-add")
            .html('<i class="fa fa-plus"></i>');
          col22.append(btnplus);
          btnplus.on("click", () => {
            item.count = item.count + 1;
            cartcount.text(item.count);
            total();
          });
          const hr = $("<hr>").css("margin-left", "4%");
          row.append(hr);
        }
      }
      if ($(".scrollcardview1").find($(".row")).length > 4) {
        $(".scrollcardview1").addClass("scroll");
      } else {
        $(".scrollcardview1").removeClass("scroll");
      }
    }
    function additemview() {
      $(".scrollcardview").empty();
      for (let i = selectedItemId.length - 1; i >= 0; i--) {
        const itemId = selectedItemId[i];
        const item = items.find((item) => item.id === itemId);
        if (item.view) {
          const scrollitem = $("<div>").addClass("scrollitem");
          $(".scrollcardview").append(scrollitem);

          const card = $("<div>").addClass("card");
          scrollitem.append(card);

          const cardimage = $("<img>")
            .addClass("card-img-top")
            .attr("src", item.image);
          card.append(cardimage);

          const cardimageoverlay = $("<div>").addClass("");
          card.append(cardimageoverlay);

          const bottomcard = $("<div>").addClass("bottom-card");
          scrollitem.append(bottomcard);

          const titleprice = $("<div>").addClass("titleprice");
          bottomcard.append(titleprice);

          const row = $("<div>").addClass("row");
          titleprice.append(row);

          const colsm61 = $("<div>").addClass("col-sm-8");
          row.append(colsm61);

          const titletext = $("<h1>").addClass("title-text").text(item.title);
          colsm61.append(titletext);

          const colsm62 = $("<div>").addClass("col-sm-4");
          row.append(colsm62);

          const icon = $("<i>").addClass("far fa-heart");
          colsm62.append(icon);

          icon.on("click", () => {
            if (!item.favorite) {
              item.favorite = true;
              icon.removeClass("far fa-heart");
              icon.addClass("fa-solid fa-heart");
            } else {
              item.favorite = false;
              icon.removeClass("fa-solid fa-heart");
              icon.addClass("far fa-heart");
            }
          });

          const bttext = $("<p>")
            .addClass("bottom-text")
            .text(item.description);
          bottomcard.append(bttext);

          const row1 = $("<div>").addClass("row");
          bottomcard.append(row1);

          const colsm622 = $("<div>").addClass("col-sm-8");
          row1.append(colsm622);

          const price = $("<h1>")
            .addClass("title-text")
            .text(item.price + "$");
          colsm622.append(price);

          const colsm611 = $("<div>").addClass("col-sm-4");
          row1.append(colsm611);

          const btnadd = $("<button>")
            .addClass("btn-add")
            .html('<i class="fa fa-plus"></i>');
          colsm611.append(btnadd);
          btnadd.on("click", () => {
            item.count = item.count + 1;
            addtocart();
            total();
          });
        }
      }
    }

    buttonleft.on("click", () => {
      container.animate({ scrollLeft: "-=300px" }, "fast");
    });

    buttonright.on("click", () => {
      container.animate({ scrollLeft: "+=300px" }, "fast");
    });
    $(".fa-heart").on("click", function () {
      $(this).toggleClass("background-heart");
    });
    function searchItems() {
      const searchInput = $("#search-input").val().toLowerCase();
      $(".scrollitem").each(function () {
        const title = $(this).find(".title-text").text().toLowerCase();
        if (title.indexOf(searchInput) > -1) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }

    $("#search-input").on("keydown", function () {
      setTimeout(function () {
        searchItems();
      }, 0);
    });
  }
});
