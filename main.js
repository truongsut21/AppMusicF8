/**
 * 1. render sóng
 * 2. scroll top
 * 3. play / pause / seek
 * 4. CD rptate
 * 5.Next / prev
 * 6. random
 * 7. next / repeat when ened
 * 8. active song
 * 9. scroll active
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// các giá trị tiêu đề, avata, nhạc của bài hát
const heading = $("header h2"); // lấy thể h2 trong header
const cdThumb = $(".cd-thumb"); // img cd
const audio = $("#audio");
const playBtn = $(".btn-toggle-play"); // nút play
const iconPlay = $(".icon-play");
const iconPause = $(".icon-pause");

const cd = $(".cd");
var isPlaying = false; // bai hat dừng
const app = {
  currentIndex: 0,
  isPlaying: false,
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

  render: function () {
    // render các dữ liệu songs ra HTML
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
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
      if (isPlaying) { // bài hát đang chạy
        audio.pause(); // bấm dừng
        iconPause.style.display = "none";
        iconPlay.style.display = "block";
      } else { // bài hát đang dừng
        audio.play(); // bấm chạy
        iconPause.style.display = "block";
        iconPlay.style.display = "none";
      }

      isPlaying = !isPlaying;
    };

    // xử lý thanh tiến độ nhạc
    audio.ontimeupdate = function(){
        console.log(audio.currentTime / audio.duration * 100)

    }
  },

  loadCurrentSong: function () {
    // tải bài hát

    // set các giá trị mặc định
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.imgUrl}')`;
    audio.src = this.currentSong.musicUrl;
  },

  start: function () {
    this.defineProperties(); // định nghĩa các thuộc tính cho obj
    this.handleEvents(); // lắng nghe sử lý các event
    this.loadCurrentSong(); // tải bài hát đầu tiền vào UI khi chạy ứng dụng
    this.render(); // render playList
  },
};

app.start();

