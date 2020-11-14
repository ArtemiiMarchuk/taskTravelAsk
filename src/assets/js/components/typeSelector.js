import * as $ from 'jquery'
import {FILTER_TYPE} from "@/assets/js/JSONframework/filterTypes"

export default class typeSelector {
    constructor({wrapperSelector, onChange}) {
        this.wrapper = $(`.${wrapperSelector}`)
        this.typeButtons = this.wrapper.find('> button')
        this.selectedSelector = `${wrapperSelector}-selected`
        this.selectedTypes = []
        this.onChange = onChange

        this.typeButtons.on('click', this.clickHandler.bind(this))
    }

    clickHandler(event) {
        const clickedButton = $(event.target)
        const isClicked = clickedButton.hasClass(this.selectedSelector)

        !isClicked ? clickedButton.addClass(this.selectedSelector) : clickedButton.removeClass(this.selectedSelector)

        this.selectedTypes = []

        this.typeButtons.map((index, item) => {
            if ($(item).hasClass(this.selectedSelector))
                this.selectedTypes.push($(item).val())
        })

        this.onChange({
            type: FILTER_TYPE,
            value: this.selectedTypes
        })
    }

    makeDefault() {
        this.typeButtons.removeClass(this.selectedSelector)
    }
}
