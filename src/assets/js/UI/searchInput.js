import * as $ from 'jquery'
import {FILTER_COUNTRY} from "@/assets/js/JSONframework/filterTypes"

export default class searchInput {
    constructor({inputId, data, onChange}) {
        this.input = $(`#${inputId}`)
        this.defaultResults = data.countries
        this.searchResults = []
        this.searchResultBlockSelector = 'hotel__inputSearchResults'
        this.noResultsMessage = 'Не найдено'
        this.onChange = onChange
        this.isOpened = false

        this.input.on('mousedown', this.focusHandler.bind(this))
        this.input.on('input', this.inputHandler.bind(this))
        $(document).on('mousedown', () => {
            this.isOpened ? this.blurHandler() : null
        })
    }

    focusHandler(event) {
        event.stopPropagation()
        this.createResultBlock()
        this.inputHandler()
    }

    get inputVal() {
        return this.input.val().trim().toLowerCase()
    }

    inputHandler() {
        const inputVal = this.inputVal

        if (!inputVal) {
            this.searchResults = this.defaultResults
            this.renderSearchResults()
            return
        }

        this.searchResults = this.searchCountries(inputVal)
        this.renderSearchResults()
    }

    searchCountries(value) {
        const output = []

        this.defaultResults.map(item => {
            if (item.toLowerCase().indexOf(value) !== -1)
                output.push(item)
        })

        return output
    }

    blurHandler() {
        this.destroyResultBlock()
        const inputVal = this.inputVal
        const value = this.searchCountries(inputVal)

        this.onChange({
            type: FILTER_COUNTRY,
            value: value
        })

        value.length === 0 && inputVal ? this.input.addClass('hotel__input-error') : this.input.removeClass('hotel__input-error')
    }

    createResultBlock() {
        if (this.isOpened)
            return

        $('body').append(`<div class="${this.searchResultBlockSelector}"></div>`)
        const resultBlock = $(`.${this.searchResultBlockSelector}`)

        resultBlock.css({
            width: this.input.css('width'),
            top: `${this.input.offset().top + 40}px`,
            left: `${this.input.offset().left}px`
        })

        this.isOpened = true
        resultBlock.on('mousedown', event => event.stopPropagation())
    }

    destroyResultBlock() {
        $(`.${this.searchResultBlockSelector}`).remove()
        this.isOpened = false
    }

    renderSearchResults() {
        const resultsBlock = $(`.${this.searchResultBlockSelector}`)
        const results = []

        if (this.searchResults.length === 0) {
            results.push(`<p>${this.noResultsMessage}</p>`)
        } else {
            this.searchResults.map(item => {
                results.push(`<p>${item}</p>`)
            })
        }

        resultsBlock.html(results.join(''))
        resultsBlock.find('> p').on('click', event => {
            this.input.val(event.target.textContent)
            this.destroyResultBlock()
        })
    }

    makeDefault() {
        this.input.val('')
        this.input.removeClass('hotel__input-error')
    }
}
