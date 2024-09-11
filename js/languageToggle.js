function toggleLanguage() {
    const enElements = document.querySelectorAll('.en');
    const jaElements = document.querySelectorAll('.ja');
  
    enElements.forEach(ele => {
        ele.style.display = (ele.style.display === "none") ? "block" : "none";
    });

    jaElements.forEach(ele => {
        ele.style.display = (ele.style.display === "none") ? "block" : "none";
    });
}
