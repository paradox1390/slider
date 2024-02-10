import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import "https://player.vimeo.com/api/player.js";

const mainSwiperWrapper = document.querySelector(".swiper .swiper-wrapper");
const modalSwiperWrapper = document.querySelector(
  ".swiper__modal .swiper-wrapper"
);
const modalSwiper = document.querySelector(".modal__container");
const closeBtnModalSwiperSlider = document.querySelector(".close-modal__btn");

const configSlider = [
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/82480422&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/824804225&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/824804225&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/82480422&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/824804225&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/824804225&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/824804225&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
  {
    url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/824804225&autoplay=false&cc=false&controls=0",
    thumbnail: null,
    iframe: null,
    player: null,
  },
];

const createMainSwiperSlide = (container, imageUrl, index) => {
  const div = document.createElement("div");
  const image = document.createElement("img");
  image.src = imageUrl;
  image.dataset.index = index;
  div.append(image);
  div.classList.add("swiper-slide");
  container.append(div);
};

const createModalSwiperSlide = (container, iframeHtml, index) => {
  const [id] = iframeHtml.match(/\d+/gm);
  const options = {
    loop: true,
    controls: false,
  };
  const div = document.createElement("div");
  const divIframeContainer = document.createElement("div");

  const player = new Vimeo.Player(divIframeContainer, { id, ...options });

  configSlider[index].player = player;

  divIframeContainer.classList.add("swiper__slider-container");
  div.classList.add("swiper-slide");
  div.append(divIframeContainer);
  container.append(div);
};

const promises = configSlider.map((slider) =>
  fetch(slider.url).then((res) => res.json())
);

Promise.allSettled(promises)
  .then((res) => {
    res.forEach((slide, index) => {
      if (slide.status === "fulfilled") {
        configSlider[index].thumbnail = slide.value.thumbnail_url;
        configSlider[index].iframe = slide.value.html;
      }
    });
  })
  .then(() => {
    configSlider.forEach((slide, index) => {
      createMainSwiperSlide(mainSwiperWrapper, slide.thumbnail, index);
      createModalSwiperSlide(modalSwiperWrapper, slide.iframe, index);
    });
    const swiper = new Swiper(".swiper", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: 4,
      controller: {
        inverse: true,
      },
    });

    const swiperModal = new Swiper(".swiper__modal", {
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      slidesPerView: 1,
    });

    let activeSliderIndex;

    closeBtnModalSwiperSlider.addEventListener("click", () => {
      modalSwiper.classList.remove("modal_fixed");
      configSlider[activeSliderIndex].player.pause();
      configSlider[activeSliderIndex].player.setCurrentTime(0);
    });

    swiper.on("click", (swiper, event) => {
      activeSliderIndex = event.target.dataset.index;
      swiperModal.slideTo(activeSliderIndex, 0, true);
      if (activeSliderIndex == swiperModal.activeIndex) {
        configSlider[activeSliderIndex].player.play();
      }
      modalSwiper.classList.add("modal_fixed");
    });

    swiperModal.on("slideChange", (swiper) => {
      if (activeSliderIndex === swiper.activeIndex) {
        configSlider[activeSliderIndex].player.play();
      } else {
        configSlider[activeSliderIndex].player.pause();
        configSlider[activeSliderIndex].player.setCurrentTime(0);
        activeSliderIndex = swiper.activeIndex;
        configSlider[swiper.activeIndex].player.play();
      }
    });
  });
