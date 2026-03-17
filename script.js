// Дожидаемся загрузки документа
document.addEventListener("DOMContentLoaded", () => {

    // ===================== Массив фильмов =====================
    const movies = [
        {
            title: "Бойцовский клуб",
            year: 1999,
            rating: 4.4,
            category: "drama",
            desc: "Подпольный бойцовский клуб.",
            img: "https://upload.wikimedia.org/wikipedia/ru/8/8a/Fight_club.jpg",
            trailer: "https://www.youtube.com/embed/SUXWAEX2jlg"
        },
        {
            title: "Интерстеллар",
            year: 2014,
            rating: 4.3,
            category: "fantasy",
            desc: "Путешествие через космос.",
            img: "https://upload.wikimedia.org/wikipedia/ru/c/c3/Interstellar_2014.jpg",
            trailer: "https://www.youtube.com/embed/zSWdZVtXT7E"
        },
        {
            title: "Матрица",
            year: 1999,
            rating: 4.35,
            category: "fantasy",
            desc: "Мир — симуляция.",
            img: "https://th.bing.com/th/id/OIP.5mTTCS3zuMbQp9vG1rtcXwHaIw?w=149&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
            trailer: "https://www.youtube.com/embed/vKQi3bBA1y8"
        },
        {
            title: "Джокер",
            year: 2019,
            rating: 4.15,
            category: "drama",
            desc: "История злодея.",
            img: "https://tse3.mm.bing.net/th/id/OIP.eVJ3CWpWbIGM3n0GNT0imAHaJR?rs=1&pid=ImgDetMain&o=7&rm=3",
            trailer: "https://www.youtube.com/embed/zAGVQLHvwOY"
        },
        {
            title: "Джон Уик",
            year: 2014,
            rating: 3.95,
            category: "action",
            desc: "Наемный убийца мстит.",
            img: "https://yt3.ggpht.com/a/AATXAJyMgyh9q-aPkf_Jfwp1_iocQn7jCsbMRcjVDA=s900-c-k-c0xffffffff-no-rj-mo",
            trailer: "https://www.youtube.com/embed/2AUmvWm5ZDQ"
        }
    ];

    // ===================== Элементы страницы =====================
    const container = document.getElementById("movies");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalTrailer = document.getElementById("modalTrailer");
    const similar = document.getElementById("similar");
    const closeModal = document.getElementById("closeModal");
    const favSlider = document.getElementById("favSlider");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");
    const categoryBtns = document.querySelectorAll("#categoryNav .cat-btn");

    // ===================== Отображение фильмов =====================
    function showMovies(list, isFav = false) {
        container.innerHTML = "";

        list.forEach((movie, i) => {
            const div = document.createElement("div");
            div.className = "movie";

            div.innerHTML = `
                <img src="${movie.img}" onclick="openModal(${i})">
                <h3>${movie.title}</h3>
                <div class="rating">${renderStars(movie.rating, i)} 
                <span class="rating-number">${movie.rating.toFixed(1)}</span></div>
                ${isFav ? `<button onclick="removeFav(${i})">🗑️ Удалить</button>` : `<button onclick="addFav(${i})">❤️</button>`}
                <button class="more" onclick="toggleInfo(${i})">Подробнее</button>
                <div class="info" id="info${i}">${movie.desc}</div>
            `;

            container.appendChild(div);

            // Плавное появление карточек
            setTimeout(() => div.classList.add("show"), i * 100);
        });
    }

    // ===================== Отображение звезд рейтинга =====================
    function renderStars(rating, i) {
        let full = Math.floor(rating);
        let half = rating - full >= 0.5;
        let html = "";
    
for (let j = 1; j <= 5; j++) {
            if (j <= full) html += `<span class="star" onclick="rate(${i},${j})">&#9733;</span>`;
            else if (j === full + 1 && half) html += `<span class="star" onclick="rate(${i},${j-0.5})">&#9733;</span>`;
            else html += `<span class="star" onclick="rate(${i},${j})">&#9734;</span>`;
        }

        return html;
    }

    // ===================== Подробнее =====================
    window.toggleInfo = i => {
        const info = document.getElementById(`info${i}`);
        info.style.display = info.style.display === "block" ? "none" : "block";
    };

    // ===================== Модальное окно =====================
    window.openModal = i => {
        modal.style.display = "flex";
        modalTitle.textContent = movies[i].title;
        modalDesc.textContent = movies[i].desc;
        modalTrailer.innerHTML = `<iframe width="100%" height="315" src="${movies[i].trailer}" frameborder="0" allowfullscreen></iframe>`;
        showSimilar(i);
    };

    function showSimilar(i) {
        similar.innerHTML = "";
        const cat = movies[i].category;
        movies.filter((m, index) => m.category === cat && index !== i)
              .forEach(m => {
                  const indexInMovies = movies.indexOf(m);
                  similar.innerHTML += `<img src="${m.img}" title="${m.title}" onclick="openModal(${indexInMovies})">`;
              });
    }

    closeModal.onclick = () => {
        modal.style.display = "none";
        modalTrailer.innerHTML = "";
        similar.innerHTML = "";
    };

    // ===================== Избранное =====================
    window.addFav = i => {
        let fav = JSON.parse(localStorage.getItem("fav")) || [];
        if (!fav.some(f => f.title === movies[i].title)) fav.push(movies[i]);
        localStorage.setItem("fav", JSON.stringify(fav));
        updateFavSlider();
    };

    window.removeFav = i => {
        let fav = JSON.parse(localStorage.getItem("fav")) || [];
        fav.splice(i, 1);
        localStorage.setItem("fav", JSON.stringify(fav));
        showFav();
        updateFavSlider();
    };

    window.showFav = () => {
        const fav = JSON.parse(localStorage.getItem("fav")) || [];
        showMovies(fav, true);
    };

    window.clearFav = () => {
        localStorage.removeItem("fav");
        showMovies(movies);
        updateFavSlider();
    };

    function updateFavSlider() {
        const fav = JSON.parse(localStorage.getItem("fav")) || [];
        favSlider.innerHTML = "";
        fav.forEach(m => {
            const indexInMovies = movies.indexOf(m);
            favSlider.innerHTML += `<div class="movie"><img src="${m.img}" title="${m.title}" onclick="openModal(${indexInMovies})"></div>`;
        });
    }

    // ===================== Фильтр по категориям =====================
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const cat = btn.dataset.cat;
            showMovies(cat === "all" ? movies : movies.filter(m => m.category === cat));
        });
    });

    // ===================== Оценка фильма =====================
    window.rate = (i, value) => {
        movies[i].rating = value;
        showMovies(movies);
    };

    // ===================== Поиск =====================
    searchInput.addEventListener("input", e => {
        const val = e.target.value.toLowerCase();
        showMovies(movies.filter(m => m.title.toLowerCase().includes(val)));
    });

    // ===================== Сортировка =====================
    sortSelect.addEventListener("change", e => {
        const val = e.target.value;
        let sorted = [...movies];
        if (val === "rating") sorted.sort((a, b) => b.rating - a.rating);
        else if (val === "year") sorted.sort((a, b) => b.year - a.year);
        else if (val === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
        showMovies(sorted);
    });

    // ===================== Инициализация =====================
    showMovies(movies);
    updateFavSlider();

});