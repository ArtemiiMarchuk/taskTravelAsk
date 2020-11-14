import toggleBlocks from "@/assets/js/UI/toggleBlocks"
import searchInput from "@/assets/js/UI/searchInput"
import jsonFramework from "@/assets/js/JSONframework/jsonFramework"
import hotelsJSON from '@/assets/hotels.json'
import checkboxesWrapper from "@/assets/js/UI/checkboxesWrapper"
import typeSelector from "@/assets/js/components/typeSelector"
import * as $ from 'jquery'
import sliderComponent from "@/assets/js/UI/sliderComponent"
import img from '@/assets/images/back.png'
import img1 from '@/assets/images/back1.png'
import img2 from '@/assets/images/back2.png'
import img3 from '@/assets/images/back3.png'
import img4 from '@/assets/images/back4.png'

export default class HotelsFilter {
    constructor({wrapperSelector}) {
        this.data = new jsonFramework({json: hotelsJSON.hotels})
        this.wrapperSelector = wrapperSelector

        new toggleBlocks({
            blocksSelector: `.${this.wrapperSelector}__toggleBlock`,
            activeClass: `${this.wrapperSelector}__toggleBlock-active`,
        })

        this.searchInput = new searchInput({
            inputId: 'searchCountry',
            data: this.data,
            onChange: this.updateFilter.bind(this)
        })

        this.checkboxes = new checkboxesWrapper({
            wrapperSelector: `.${this.wrapperSelector}__checkboxesWrapper`,
            onChange: this.updateFilter.bind(this)
        })

        this.typeSelector = new typeSelector({
            wrapperSelector: `${this.wrapperSelector}__selectType`,
            onChange: this.updateFilter.bind(this)
        })

        this.slideComponent = new sliderComponent({
            sliderSelector: `.${this.wrapperSelector}__priceSlider`,
            data: this.data,
            onChange: this.filterByPrice.bind(this)
        })

        this.clearSelectorsButton = $(`.${this.wrapperSelector}__clearSelectors > span`)
        this.showMoreButton = $(`.${this.wrapperSelector}__showMorePosts`)

        this.clearSelectorsButton.on('click', this.clearSelectors.bind(this))
        this.showMoreButton.on('click', this.showMorePosts.bind(this))

        this.renderHotels()
    }

    showMorePosts() {
        const offset  = $(`.${this.wrapperSelector}__post`).length
        const posts = this.renderPosts(this.data.Hotels, offset).filter(el => el)
        $(`.${this.wrapperSelector}__postsWrapper`).append(posts.join(''))

        if (posts.length < 6) {
            this.showMoreButton.hide()
        }
    }

    clearSelectors() {
        this.searchInput.makeDefault()
        this.checkboxes.makeDefault()
        this.typeSelector.makeDefault()
        this.slideComponent.makeDefault()
        this.data.clearFilters()
        this.renderHotels()
    }

    updateFilter({type, value}) {
        this.data.filterData({type, value})
        this.renderHotels()
    }

    filterByPrice({min, max}) {
        this.data.filterPrice({min, max})
        this.data.updateData()

        this.renderHotels()
    }

    renderHotels() {
        const hotelsPosts = this.renderPosts(this.data.Hotels)

        $(`.${this.wrapperSelector}__postsWrapper`).html(
            hotelsPosts.length === 0
                ? `<div class="hotel__noResultsCaption">Записей не найдено</div>`
                : hotelsPosts.join('')
        )

        hotelsPosts.length === 0 ? this.showMoreButton.hide() : this.showMoreButton.show()
    }

    renderPosts(data, startOffset = 0, count = 6) {
        return data.map((item, index) => {
            if (index <= startOffset - 1 || index + 1 > startOffset + count) return

            const imgBlock = `<img class="hotel__img" src="./images/${item.image}">`
            const locationBlock = `<div class="hotel__postLocation">${item.address}</div>`
            const titleBlock = `<h2 class="hotel__title">${item.name}</h2>`
            const star = '<div class="hotel__star"></div>'
            const starLabel = `<div class="hotel__starLabel">${item.stars} звезд${item.stars === 0 ? 'a' : item.stars < 5 ? 'ы' : ''}</div>`
            const typeLabel = `<h4 class="hotel__type">${item.type}</h4>`
            const descriptionBlock = `<h3 class="hotel__description">${item.description}</h3>`
            const priceBlock = `<div class="hotel__price">от ${item.min_price}&#8381;</div>`
            const bookButton = `<div class="hotel__book">Забронировать</div>`
            const stars = []
            for (let i = 0; i < item.stars; i++) {
                stars.push(star)
            }

            const feedBackBlock = `<div class="hotel__feedBack">` +
                (item.last_review
                    ? `<div class="hotel__ratingStar"></div>`
                    + `<div class="hotel__ratingNumber">${item.rating}</div>`
                    + '<div class="hotel__dot"></div>'
                    + `<div class="hotel__ratingNumber">${item.rating > 3 ? 'Хорошо' : 'Нормально'}</div>`
                    + '<div class="hotel__dot"></div>'
                    + `<div class="hotel__ratingNumber">${item.reviews_amount} отзывов</div>`
                    + `<div class="hotel__review">"${item.last_review}"</div>`
                    : `<div class="hotel__noreviewIcon"></div>`
                    + `<div class="hotel__noreviewText">Нет оценок.</div>`)
                + `</div>`

            return `<div class="hotel__post"><div>${imgBlock}</div>` +
                `<div class="hotel__postContent">${locationBlock}${titleBlock}${stars.join('')}${starLabel}${typeLabel}${descriptionBlock}</div>` +
                `<div>${feedBackBlock}${priceBlock}${bookButton}</div></div><div class="hotel__postLine"></div>`
        })
    }
}
