//1 dom elements ////////////////////////////////////////////////////////////////
let elList = document.querySelector(".list")
let elResForm = document.querySelector(".res-form")
let elFormSearch = document.querySelector(".form-search")
let elInputsearch = document.querySelector(".search")
let elBookList = document.querySelector(".booklist")
let eliInputPagesStart = document.querySelector(".input-pages-start")
let eliInputPagesFinish = document.querySelector(".input-pages-finish")
let elSelectLanguage = document.querySelector(".select-lenguage")
let elSelectAll = document.querySelector(".select-all")
let eltemplate = document.querySelector(".list-template").content
books.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
let frogment = new DocumentFragment()
let lenguageArray = []
const bookmarkArray = JSON.parse(localStorage.getItem("bukmark")) ||[]
let bokmark = 0
//2 createElement/////////////////////////////////////////////////////////////////
function crateList(arr,titleRegex = "") {
  // elList.innerHTML = ""
  arr.forEach(function (item) {
    let clonedTemplate = eltemplate.cloneNode(true)
    ++bokmark
    if(titleRegex.source !== "(?:)" && titleRegex){
      clonedTemplate.querySelector(".card-title").innerHTML = item.title.replace(titleRegex,
        `<mark class="p-0 bg-success text-white">${titleRegex.source}</mark>`);
    }else{
      clonedTemplate.querySelector(".card-title").textContent = item.title
    }

    clonedTemplate.querySelector(".card").dataset.bukid = bokmark
    clonedTemplate.querySelector(".bokmark").dataset.bukid = bokmark
    clonedTemplate.querySelector(".card-img").src = item.imageLink
    clonedTemplate.querySelector(".card-year").textContent = item.year
    clonedTemplate.querySelector(".card-page").textContent = item.pages
    clonedTemplate.querySelector(".card-lenguage").textContent = item.language
    clonedTemplate.querySelector(".card-author").textContent = item.author
    clonedTemplate.querySelector(".card-link").href = item.link
 

    frogment.appendChild(clonedTemplate)
  })
  elList.appendChild(frogment)
}
crateList(books)
//3 language elements ////////////////////////////////////////////////////////////
function lenguageFilter() {
  books.forEach(function (item) {
    if (!lenguageArray.includes(item.language)) {
      lenguageArray.push(item.language)
    }
  })
  lenguageArray.sort()
  lenguageArray.forEach(function (item) {
    let option = document.createElement("option")
    option.value = item
    option.text = item
    elSelectLanguage.appendChild(option)
  })
}
lenguageFilter()
//4 filter function //////////////////////////////////////////////////////////////
elResForm.addEventListener("submit", function (evt) {
  evt.preventDefault()
  const elSelectLanguageValue = elSelectLanguage.value
  const filterLanguage = books.filter(item => {
    return item.language.includes(elSelectLanguageValue)
  })
  crateList(filterLanguage)
  // pagesFilter() 




  if (elSelectAll.value == "Az") {
    Az()
  } else if (elSelectAll.value == "Za") {
    Za()
  } else if (elSelectAll.value == "yft") {
    yearFromTo()
  } else if (elSelectAll.value == "ytf") {
    yearToFrom()
  } else if (elSelectAll.value == "pft") {
    pagesToFrom()
  } else if (elSelectAll.value == "ptf") {
    pagesFromTo()
  }

  showSearchMovies()
})
//5 pages filter /////////////////////////////////////////////////////////////////
function pagesFilter() {
  let pagesStartValue = eliInputPagesStart.value
  let pagesFinishrValue = eliInputPagesFinish.value
  if (pagesStartValue !== "" && pagesFinishrValue !== "") {
    let pageFilter = books.filter(item => {
      if (item.pages >= pagesStartValue && item.pages <= pagesFinishrValue) {
        return true
      }
    })
    crateList(pageFilter)
  }


}
//6 select all ///////////////////////////////////////////////////////////////////
function Az() {
  books.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
}

function Za() {
  books.sort((a, b) => b.title.charCodeAt(0) - a.title.charCodeAt(0))
}

function yearFromTo() {
  books.sort((a, b) => a.year - b.year)
}

function yearToFrom() {
  books.sort((a, b) => b.year - a.year)
}

function pagesToFrom() {
  books.sort((a, b) => b.pages - a.pages)
}

function pagesFromTo() {
  books.sort((a, b) => a.pages - b.pages)
}

function showSearchMovies() {

  let res = books.filter(item => {

    const meetsCriteria = (elSelectLanguage.value === "All" ||
      item.language.includes(elSelectLanguage.value)) && (elSelectAll.value === "All" ||
      elSelectAll.value) && (eliInputPagesStart.value.trim() === '' ||
      item.pages >= Number(eliInputPagesStart.value)) && (eliInputPagesFinish.value.trim() === '' ||
      item.pages <= Number(eliInputPagesFinish.value));
    return meetsCriteria;
  });
 crateList(res)
 
} 

elFormSearch.addEventListener("submit", function (evt) {
  evt.preventDefault()
  const searchElement = new RegExp(elInputsearch.value.trim(), "gi");
  const  searchbookFilteredList = books.filter((item) => String(item.title).match(searchElement))
  if(searchbookFilteredList.length > 0){
     crateList(searchbookFilteredList,searchElement)
  }else{
    alert("Movie not found");
  }

})

elList.addEventListener("click", function (evt) {
  if (evt.target.matches(".bokmark")) {
    let btnid = evt.target.dataset.bukid;
    let btn = evt.target;
    btn.style.backgroundImage = `url("../icons/heart\ \(1\).png")`

    let bukfind = books.find(item => item.id == btnid);

    if (!bookmarkArray.includes(bukfind)) {
      bookmarkArray.push(bukfind)
    }
    bukmark(bookmarkArray)
    localStorage.setItem("bukmark", JSON.stringify(bookmarkArray))
  }
  console.log(bookmarkArray);
})
let bukFragment = new DocumentFragment()
function bukmark(arr) {
  elBookList.innerHTML = ""
 arr.forEach(function (item) {
  let items = document.createElement('li')
  let itemImg = document.createElement('img')
  let itemTitle = document.createElement('p')
  let itemDel = document.createElement('button')
  
   items.classList.add("bukitem")
   itemImg.classList.add("bukitem-img")
   itemTitle.classList.add("text-center","bukitem-title")
   itemDel.classList.add("bukitem-del")

   itemDel.dataset.delid = item.id
  itemImg.dataset.imgid = item.id
  itemImg.src = item.imageLink
  itemTitle.textContent = item.title
  itemDel.textContent = "delite"
items.appendChild(itemImg)
items.appendChild(itemTitle)
   items.appendChild(itemDel)
   bukFragment.appendChild(items)
})
elBookList.appendChild(bukFragment)
}

elBookList.addEventListener("click", function (evt) {
  if (evt.target.matches(".bukitem-del")) {
    let delbtnid = evt.target.dataset.delid
    let delFindIndex = bookmarkArray.findIndex(item => item.id == delbtnid)
    bookmarkArray.splice(delFindIndex, 1)
    bukmark(bookmarkArray)
    localStorage.setItem("bukmark", JSON.stringify(bookmarkArray))
  }
  if (evt.target.matches(".bukitem-img")) {
    let imgids = evt.target.dataset.imgid
    let imgfind = bookmarkArray.find(item => item.id == imgids)
    let bukSearch = books.filter(item => item.title.match(imgfind.title))
    crateList(bukSearch)
  }
})
bukmark(bookmarkArray)
// let num = 0
// const normalizeFullMovies = books.map(item => {
//   ++num
//  return{
//       title: item.title.toString() ,
//       year: item.year,
//       language: item.language,
//       imageLink: item.imageLink,
//       country: item.country,
//       link: item.link,
//       pages: item.pages,
//       author: item.author,
//       id: num,
//  }
// })