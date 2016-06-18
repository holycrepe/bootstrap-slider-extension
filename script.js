var create_interval = (start, end, length) =>
    _.range(start, end + 1, (end - start) / (length - 1));

function create_ticked_slider(options, selector) {
    var $input = $(selector);
    var id = $input.attr('id');
    var defaultOptions = {
        activeClass: "slider-tick-label-active",
        valueLabel: true
    }
    if (id) {
        defaultOptions.id = id + "-slider";
    }
    options = $.extend(defaultOptions, options);
    var activeClass = options.activeClass;
    var ticks = false,
        tick_count = 0;
    if (options.ticks_labels) {
        tick_count = options.ticks_labels.length;
        var interval = (options.max - options.min) / (tick_count - 1);
        ticks = _.map(options.ticks_labels, (tick, i) =>
            new(function SliderTick() {
                this.name = tick;
                this.index = i;
                this.value = Math.round(options.min + interval * i);
                this.key = tick.toLowerCase().split(" ").join("-");
                this.class = `slider-tick-label-${this.key}`;
                this.label = `<label data-tick-value='${this.value}' class='slider-tick-label ${this.class}'>${tick}</label>`;

            })());
        //debugger;
    }

    var $value = false;
    if (options.valueLabel === true) {
        $value = $input.siblings(".slider-value").first();
    } else if (options.valueLabel) {
        $value = $(options.valueLabel);
    }

    if (ticks && !options.ticks) {
        options.ticks_labels = _.map(ticks, _.property('label'));
        options.ticks = _.map(ticks, _.property('value'));
    }
    var $slider = new Slider(selector, options);
    var $labels = $($slider.tickLabelContainer).children();
    $labels.each((i, label) => {
        var tick = ticks[i];
        var $label = $(label);
        $label
            .addClass(tick.class)
            .attr("data-tick-value", tick.value);
    });
    var onSliderValueChanged = value => {
        if ($value) {
            $value.text(value);
        }
        if (!ticks) {
            return;
        }
        var tick = ticks[0];
        for (var i = 0; i < tick_count; i++) {
            if (value >= ticks[i].value)
                tick = ticks[i];
        }
        $labels.removeClass(activeClass);
        $labels.find("label.slider-tick-label").removeClass(activeClass);
        var $label = $labels.filter("." + tick.class);
        $label.addClass(activeClass);
    };
    $labels.find("label").on("click", 
                             e => $slider.setValue(Number($(e.currentTarget).attr('data-tick-value')), true, true)
    );
    $slider.on("change", e => onSliderValueChanged(e.newValue));
    onSliderValueChanged(options.value);
    return $slider;
}
var options = {
    min: 1,
    max: 100,
    value: 25,
    //valueLabel: false,
    ticks_labels: ["Small", "Medium", "Large", "Extra Large"],
    ticks_snap_bounds: 5,
    tooltip: 'hide',
    formatter: value => 'Tile Size: ' + value
};
var $slider = create_ticked_slider(options, '#grid-file-tile-size');