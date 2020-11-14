import * as $ from 'jquery'
import 'jquery-ui-dist/jquery-ui.js'
import 'jquery-ui/themes/base/slider.css'
import '../../styles/slider.scss'

export default class sliderComponent {
    constructor({sliderSelector, data, onChange}) {
        this.sliderElement = $(sliderSelector)
        this.onChange = onChange
        const {min, max} = data.minMaxPrice
        this.defaultMin = min
        this.defaultMax = max
        this.min = min
        this.max = max

        this.sliderElement.slider({
            max: this.max,
            min: this.min,
            step: 1,
            range: true,
            values: [ this.min, this.max ],
            animate: "fast",
            change: this.changeHandler.bind(this),
            slide: (event, ui) => this.slideHandle(event, ui.values),
        })

        this.slideHandle({target: this.sliderElement}, [this.min, this.max])
    }

    changeHandler() {
        const values = this.sliderElement.slider('values')
        this.onChange({
            min: values[0],
            max: values[1]
        })
    }

    slideHandle(event, value) {
        const slider = $(event.target)
        const sliderSpan1 = $(slider.find('> span.ui-slider-handle')[0])
        const sliderSpan2 = $(slider.find('> span.ui-slider-handle')[1])

        sliderSpan1.attr('data-price', value[0])
        sliderSpan2.attr('data-price', value[1])
    }

    makeDefault() {
        this.min = this.defaultMin
        this.max = this.defaultMax

        this.sliderElement.slider('values', 0, this.min)
        this.sliderElement.slider('values', 1, this.max)
        this.slideHandle({target: this.sliderElement}, [this.min, this.max])
    }
}
