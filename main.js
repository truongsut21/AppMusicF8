/**
 * 1. render sóng
 * 2. scroll top
 * 3. play / pause / seek
 * 4. CD rptate
 * 5.Next / prev
 * 6. random
 * 7. next / repeat when ened
 * 8. active song
 * 9. scroll active--------------------- tự nghĩ cách xử lý js
 * 10. lưu setting vào local
 *  */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "SETING_PLAYER_MUSIC_F8"; // lưu giá trị israndom, isRepeat vào local

// các giá trị tiêu đề, avata, nhạc của bài hát
const heading = $("header h2"); // lấy thể h2 trong header
const cdThumb = $(".cd-thumb"); // img cd
const audio = $("#audio");

const playBtn = $(".btn-toggle-play"); // nút play
const iconPlay = $(".icon-play");
const iconPause = $(".icon-pause");
const progress = $("#progress"); // thanh chạy nhạc
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playList = $(".playlist");
const elSong = $(".song");

const cd = $(".cd");
var isPlaying = false; // bai hat dừng
var isRandom = false; // dag tắt random
var isRepeat = false; // đang tắt repeat.

// gía trị lưu về của local PLAYER_STORAGE_KEY
var config = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}; // nếu vế 1 không tồn tại thì lấy vế 2

const app = {
  currentIndex: 0,
  songs: [
    {
      name: "Đám Cưới Nha?",
      singer: "Hồng Thanh; DJ Mie",
      musicUrl:
        "https://data.chiasenhac.com/down2/2232/5/2231831-3e0343cf/128/Dam%20Cuoi%20Nha_%20-%20Hong%20Thanh_%20DJ%20Mie.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/158/157878.jpg",
    },

    {
      name: "Ngày Đầu Tiên",
      singer: "Đức Phúc",
      musicUrl:
        "https://data.chiasenhac.com/down2/2224/5/2223570-77fd7172/128/Ngay%20Dau%20Tien%20-%20Duc%20Phuc.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/155/154910.jpg",
    },

    {
      name: "Ánh Nắng Của Anh",
      singer: "Đức Phúc",
      musicUrl:
        "https://data3.chiasenhac.com/downloads/1751/5/1750325-63589c26/128/Anh%20Nang%20Cua%20Anh%20-%20Duc%20Phuc.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/69/68690.jpg",
    },

    {
      name: "Bông Hoa Đẹp Nhất",
      singer: "Quân A.P",
      musicUrl:
        "https://data3.chiasenhac.com/downloads/2116/5/2115047-a7b21f25/128/Bong%20Hoa%20Dep%20Nhat%20-%20Quan%20A_P.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/128/127105.jpg",
    },

    {
      name: "See Tình (Cukak Remix)",
      singer: "Cukak; Hoàng Thùy Linh",
      musicUrl:
        "https://data.chiasenhac.com/down2/2237/5/2236543-fec21a16/128/See%20Tinh%20Cukak%20Remix_%20-%20Cukak_%20Hoang%20Thu.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/160/159527.jpg",
    },

    {
      name: "Lạc Trôi",
      singer: "Sơn Tùng M-TP",
      musicUrl:
        "https://data37.chiasenhac.com/downloads/1897/5/1896718-b91ec523/128/Lac%20Troi%20-%20Son%20Tung%20M-TP.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/87/86272.jpg",
    },

    {
      name: "Muộn Rồi Mà Sao Còn",
      singer: "Sơn Tùng M-TP",
      musicUrl:
        "https://data.chiasenhac.com/down2/2169/5/2168156-4608576a/128/Muon%20Roi%20Ma%20Sao%20Con%20-%20Son%20Tung%20M-TP.mp3",
      imgUrl: "https://data.chiasenhac.com/data/cover/140/139611.jpg",
    },
  ],

  setConfig: function (key, value) {
    config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(config));
  },
  render: function () {
    // render các dữ liệu songs ra HTML
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }"  data-index=${index}>
            <div class="thumb" style="background-image: url('${song.imgUrl}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });

    document.querySelector(".playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      // thêm thuộc tính currentSong vaoftrong obj app
      get: function () {
        return this.songs[this.currentIndex]; // khi gọi tới thuộc tính currentSong thì sẽ trả về mảng this.currentIndex cụ thể là songs[0]
      },
    });
  },

  handleEvents: function () {
    // tất cả các sự kiện sẽ đưuọc đưa vào ở đây

    // sử lý phong to / thu nhỏ cd
    const cdWith = cd.offsetWidth; // lấy chiều cao của class .cd-thumb
    document.onscroll = function (e) {
      // sử lý sự kiện lăn chuột trên toàn trang
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // kích thước khoảng cách lăn chuột

      const newCdWidth = cdWith - scrollTop > 0 ? cdWith - scrollTop : 0; // nếu cdWith - scrollTop > 0 thì sẽ lấy cdWith - scrollTop để thu nhỏ dần, nếu quá hơn cho về 0 cho chuẩn làm class cd ẩn đi
      cd.style.width = newCdWidth + "px"; // set kích thước
      cd.style.opacity = newCdWidth / cdWith; // làm mờ
    };

    // xử lý play / pause
    playBtn.onclick = function () {
      if (isPlaying) {
        // bài hát đang chạy
        audio.pause(); // bấm dừng
        app.cdThumbAnimate.pause(); // animate cd dừng
        iconPause.style.display = "none";
        iconPlay.style.display = "block";
      } else {
        // bài hát đang dừng
        audio.play(); // bấm chạy
        app.cdThumbAnimate.play(); // animate cd chạy
        iconPause.style.display = "block";
        iconPlay.style.display = "none";
      }

      isPlaying = !isPlaying;
    };

    // xử lý thanh tiến độ nhạc
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 1000
        ); // phần trăm thanh nhạc đã chạy
        progress.value = progressPercent;
      }
    };

    // xử lý tua nhạc
    progress.onchange = function (e) {
      const seekTime = (e.target.value / 1000) * audio.duration; // value thanh tua nhạc
      audio.currentTime = seekTime; // set value tua cho thanh nhac khi change
    };

    // xử lý next
    btnNext.onclick = function () {
      if (isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
        app.autoPlay();
      }
    };

    // xử lý prev
    btnPrev.onclick = function () {
      if (isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
        app.autoPlay();
      }
    };

    // xử lý sự kiện bật / tắt random
    btnRandom.onclick = function () {
      isRandom = !isRandom;

      btnRandom.classList.toggle("active", isRandom);
      if (isRandom) {
        // tắt repeat  khi bật random
        isRepeat = true;
        btnRepeat.click();
      }

      app.setConfig("isRandom", isRandom); // luu vao local
      app.setConfig("isRepeat", isRepeat); // luu vao local
    };

    // xử lý audio next khi kết thúc
    (audio.onended = function () {
      if (isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    }),
      // xử lặp lại bài hát
      (btnRepeat.onclick = function () {
        isRepeat = !isRepeat;
        btnRepeat.classList.toggle("active", isRepeat);
        if (isRepeat) {
          // tắt random khi bật repeat
          isRandom = true;
          btnRandom.click();
        }

        app.setConfig("isRandom", isRandom); // luu vao local
        app.setConfig("isRepeat", isRepeat); // luu vao local
      });

    // xử lý click vào list song html
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          app.currentIndex = Number(songNode.getAttribute("data-index")); // ép kiểu

          app.loadCurrentSong();
          app.autoPlay();
        }

        if (e.target.closest(".option")) {
          console.log("da chon option");
        }
      }
    };

    // xử lý audio next khi kết thúc
    audio.onended = function () {
      if (isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
  },

  // tải bài hát
  loadCurrentSong: function () {
    // set các giá trị mặc định
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.imgUrl}')`;
    audio.src = this.currentSong.musicUrl;
  },

  // load setting local
  loadConfig: function() {
    isRandom = config.isRandom
    isRepeat = config.isRepeat


  },

  // load active cho random / repeat 

  loadSettingActiveLocal: function() {
    btnRepeat.classList.toggle("active", isRepeat);
    btnRandom.classList.toggle("active", isRandom);
  },

  // next bài nhạc
  nextSong: function () {
    if (this.currentIndex >= this.songs.length - 1) {
      this.currentIndex = -1;
    }
    this.currentIndex++;

    this.loadCurrentSong();
  },

  // lui bài nhạc
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }

    this.loadCurrentSong();
  },

  // xủ lý đĩa quay / dừng
  cdThumbAnimate: cdThumb.animate(
    [
      {
        transform: "rotate(360deg)", // quay 360
      },
    ],
    {
      duration: 30000, // 10s
      interations: Infinity,
    }
  ),

  autoPlay: function () {
    audio.play(); // auto chay
    this.cdThumbAnimate.play(); // animate cd chạy
    isPlaying = true;
    iconPause.style.display = "block";
    iconPlay.style.display = "none";

    this.render(); // render lại để nhận active song HTML
  },

  // random
  playRandomSong: function () {
    let newIndex = 0;

    // lấy currentIndex ngẫu nhiên
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex; // gán giá trị mới random cho currentIndex
    this.loadCurrentSong();
    this.autoPlay();
  },

  start: function () {
    this.loadConfig() // cấu hình setting random, repeat  lần đầu khi mở trang lấy dữ  liệu từ local
    this.loadSettingActiveLocal() // cấu hình setting active class random, repeat  lần đầu khi mở trang lấy dữ
    this.defineProperties(); // định nghĩa các thuộc tính cho obj
    this.handleEvents(); // lắng nghe sử lý các event
    this.cdThumbAnimate.pause(); // dừng sẵn cd thumb
    this.loadCurrentSong(); // tải bài hát đầu tiền vào UI khi chạy ứng dụng
    this.render(); // render playList
  },
};

app.start();

// 1:07
