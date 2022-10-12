("use strict");
class MenuButtonLinks {
  constructor(domNode) {
    this.domNode = domNode;
    this.buttonNode = domNode.querySelector("button");
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = [];
    this.firstMenuitem = false;
    this.lastMenuitem = false;
    this.firstChars = [];
    this.buttonNode.addEventListener(
      "keydown",
      this.onButtonKeydown.bind(this)
    );
    this.buttonNode.addEventListener("click", this.onButtonClick.bind(this));

    // this.buttonNode.addEventListener(
    //   "mouseover",
    //   this.openPopup.bind(this)
    // );

    // Good code line 23-26
    this.domNode.addEventListener(
      "mouseover",
      this.responsiveOpenPopup.bind(this)
    );

    // this.menuNode.addEventListener("mouseleave", this.closePopup.bind(this));
    // this.buttonNode.addEventListener("mouseleave", this.closePopup.bind(this));

    // Good code line 31
    this.domNode.addEventListener(
      "mouseleave",
      this.responsiveClosePopup.bind(this)
    );

    // wait a sec or 2 be
    // I know if leave the button but did I hover the menu?
    // Is there another event similar to mouseover for mouseleave?
    /* TODO mouseleave and mouseout are similar but differ in that 
            mouseleave does not bubble and mouseout does. 
            This means that mouseleave is fired when the pointer has exited the element
            and all of its descendants, whereas mouseout is fired 
            when the pointer leaves the element or leaves one of the element's descendants
            (even if the pointer is still within the element).*/
    // What component in our code has similar feature.
    // TODO NOTE: TOOLTIP? Couldn't find other component in our code that would appear on hover
    // if we use libray then should visit the library source code
    var nodes = domNode.querySelectorAll('[role="menuitem"]');
    for (var i = 0; i < nodes.length; i++) {
      var menuitem = nodes[i];
      this.menuitemNodes.push(menuitem);
      menuitem.tabIndex = -1;
      this.firstChars.push(menuitem.textContent.trim()[0].toLowerCase());
      menuitem.addEventListener("keydown", this.onMenuitemKeydown.bind(this));
      menuitem.addEventListener(
        "mouseover",
        this.onMenuitemMouseover.bind(this)
      );
      if (!this.firstMenuitem) {
        this.firstMenuitem = menuitem;
      }
      this.lastMenuitem = menuitem;
    }
    domNode.addEventListener("focusin", this.onFocusin.bind(this));
    domNode.addEventListener("focusout", this.onFocusout.bind(this));
    window.addEventListener(
      "mousedown",
      this.onBackgroundMousedown.bind(this),
      true
    );
  }
  setFocusToMenuitem(newMenuitem) {
    this.menuitemNodes.forEach(function (item) {
      if (item === newMenuitem) {
        item.tabIndex = 0;
        newMenuitem.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  }
  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }
  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }
  setFocusToPreviousMenuitem(currentMenuitem) {
    var newMenuitem, index;
    if (currentMenuitem === this.firstMenuitem) {
      newMenuitem = this.lastMenuitem;
    } else {
      index = this.menuitemNodes.indexOf(currentMenuitem);
      newMenuitem = this.menuitemNodes[index - 1];
    }
    this.setFocusToMenuitem(newMenuitem);
    return newMenuitem;
  }
  setFocusToNextMenuitem(currentMenuitem) {
    var newMenuitem, index;
    if (currentMenuitem === this.lastMenuitem) {
      newMenuitem = this.firstMenuitem;
    } else {
      index = this.menuitemNodes.indexOf(currentMenuitem);
      newMenuitem = this.menuitemNodes[index + 1];
    }
    this.setFocusToMenuitem(newMenuitem);
    return newMenuitem;
  }
  setFocusByFirstCharacter(currentMenuitem, char) {
    var start, index;
    if (char.length > 1) {
      return;
    }
    char = char.toLowerCase();
    // Get start index for search based on position of currentItem
    start = this.menuitemNodes.indexOf(currentMenuitem) + 1;
    if (start >= this.menuitemNodes.length) {
      start = 0;
    }
    // Check remaining slots in the menu
    index = this.firstChars.indexOf(char, start);
    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.firstChars.indexOf(char, 0);
    }
    // If match was found...
    if (index > -1) {
      this.setFocusToMenuitem(this.menuitemNodes[index]);
    }
  }
  // Utilities
  getIndexFirstChars(startIndex, char) {
    for (var i = startIndex; i < this.firstChars.length; i++) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
    return -1;
  }
  // Popup menu methods
  responsiveOpenPopup() {
    if (window.innerWidth <= 771) {
      return;
    }
    this.menuNode.style.display = "block";
    this.buttonNode.setAttribute("aria-expanded", "true");
  }

  openPopup() {
    if (window.innerWidth < 770) {
      // this.menuNode.style.maxHeight = 500;
      this.menuNode.style.display = "contents";
      // this.menuNode.style.backgroundColor = "#f7f7f7";
      this.buttonNode.setAttribute("aria-expanded", "true");
    } else {
      this.menuNode.style.display = "block";
      this.buttonNode.setAttribute("aria-expanded", "true");
    }
  }

  responsiveClosePopup() {
    if (window.innerWidth <= 771) {
      return;
    }
    if (this.isOpen()) {
      this.buttonNode.removeAttribute("aria-expanded");
      this.menuNode.style.display = "none";
    }
  }

  closePopup() {
    if (this.isOpen()) {
      this.buttonNode.removeAttribute("aria-expanded");
      this.menuNode.style.display = "none";
    }
  }

  isOpen() {
    return this.buttonNode.getAttribute("aria-expanded") === "true";
  }
  // Menu event handlers
  onFocusin() {
    this.domNode.classList.add("focus");
  }
  onFocusout() {
    this.domNode.classList.remove("focus");
  }
  onButtonKeydown(event) {
    var key = event.key,
      flag = false;
    switch (key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
        break;
      case "Esc":
      case "Escape":
        this.closePopup();
        this.buttonNode.focus();
        flag = true;
        break;
      case "Up":
      case "ArrowUp":
        this.openPopup();
        this.setFocusToLastMenuitem();
        flag = true;
        break;
      default:
        break;
    }
    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  onButtonClick(event) {
    if (this.isOpen()) {
      this.closePopup();
      this.buttonNode.focus();
    } else {
      this.openPopup();
      this.setFocusToFirstMenuitem();
    }
    event.stopPropagation();
    event.preventDefault();
  }

  onMenuitemKeydown(event) {
    var tgt = event.currentTarget,
      key = event.key,
      flag = false;
    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    if (event.shiftKey) {
      if (isPrintableCharacter(key)) {
        this.setFocusByFirstCharacter(tgt, key);
        flag = true;
      }
      if (event.key === "Tab") {
        this.buttonNode.focus();
        this.closePopup();
        flag = true;
      }
    } else {
      switch (key) {
        case " ":
          window.location.href = tgt.href;
          break;
        case "Esc":
        case "Escape":
          this.closePopup();
          this.buttonNode.focus();
          flag = true;
          break;
        case "Up":
        case "ArrowUp":
          this.setFocusToPreviousMenuitem(tgt);
          flag = true;
          break;
        case "ArrowDown":
        case "Down":
          this.setFocusToNextMenuitem(tgt);
          flag = true;
          break;
        case "Home":
        case "PageUp":
          this.setFocusToFirstMenuitem();
          flag = true;
          break;
        case "End":
        case "PageDown":
          this.setFocusToLastMenuitem();
          flag = true;
          break;
        case "Tab":
          this.closePopup();
          break;
        default:
          if (isPrintableCharacter(key)) {
            this.setFocusByFirstCharacter(tgt, key);
            flag = true;
          }
          break;
      }
    }
    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  onMenuitemMouseover(event) {
    var tgt = event.currentTarget;
    tgt.focus();
  }
  onBackgroundMousedown(event) {
    if (!this.domNode.contains(event.target)) {
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
      }
    }
  }
}

// Initialize menu buttons
window.addEventListener("load", function () {
  var menuButtons = document.querySelectorAll(".menu-button-links");
  for (let i = 0; i < menuButtons.length; i++) {
    new MenuButtonLinks(menuButtons[i]);
  }
});
