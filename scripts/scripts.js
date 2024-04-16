function Clock() {
    let time = new Date();

    let timeZoneOffsetInMinutes = time.getTimezoneOffset();
    let timeZoneSign = timeZoneOffsetInMinutes > 0 ? '-' : '+';
    let timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffsetInMinutes / 60));

    this.hour = time.getHours();
    this.minute = time.getMinutes();
    this.second = time.getSeconds();
    this.period = (this.hour < 12) ? '"AM"' : '"PM"';
    this.day = time.getDate();
    this.weekday = en_week_days_name[time.getDay()];
    this.month = en_month_name[time.getMonth()];
    this.year = time.getFullYear();
    this.timezone = `"GMT${timeZoneSign}${timeZoneOffsetHours.toString().padStart(2, '0')}"`;
    this.unix = Math.floor(Date.now() / 1000);
}

function Settings() {
    this.clock = {
        elements: {
            hour: {
                order: 0,
                visibility: true,
                type: 'number'
            },
            minute: {
                order: 1,
                visibility: true,
                type: 'number'
            },
            second: {
                order: 2,
                visibility: true,
                type: 'number'
            },
            period: {
                order: 3,
                visibility: true,
                type: 'string'
            },
            day: {
                order: 4,
                visibility: true,
                type: 'number'
            },
            weekday: {
                order: 5,
                visibility: false,
                type: 'string'
            },
            month: {
                order: 6,
                visibility: true,
                type: 'string'
            },
            year: {
                order: 7,
                visibility: true,
                type: 'number'
            },
            timezone: {
                order: 8,
                visibility: false,
                type: 'string'
            },
            unix: {
                order: 9,
                visibility: false,
                type: 'number'
            }
        },
    }

    this.format = {
        use_12h_format: false,
        show_leading_zero: false,
        use_const_declaration: false
    }

    this.visibility = {
        customization: {
            enable: false
        }
    }

    this.position = {
        customization: {
            enable: false
        },
        x: 'center',
        y: 'center'
    }

    this.theme = {
        customization: {
            enable: false
        },
        name: 'main'
    }

    this.font = {
        size: 32,
        family: 'inherit'
    }
}

const changeable_format_elements = ['hour', 'minute', 'second', 'day']
const possible_declarations = ['let', 'const']

const en_month_name = ['"January"', '"February"', '"March"', '"April"', '"May"', '"June"', '"July"', '"August"', '"September"', '"October"', '"November"', '"December"'];
const en_week_days_name = ['"Sunday"', '"Monday"', '"Tuesday"', '"Wednesday"', '"Thursday"', '"Friday"', '"Saturday"'];

const themes = {
    main: "./styles/main.css",
    jb_dark: "./styles/jb-dark.css",
    jb_light: "./styles/jb-light.css",
    dark_moder: "./styles/dark-modern.css",
    light_moder: "./styles/light-modern.css",
    one_dark_pro: "./styles/one-dark-pro.css",
    dracula_official: "./styles/dracula-official.css",
    github_theme: "./styles/github-theme.css",
    code_time: "./styles/code-time.css",
    rose_pine: "./styles/rose-pine.css"
}

const default_settings = new Settings()

function convertTo12hFormat(hour) {
    hour %= 12

    if (hour === 0) {
        return 12
    }

    return hour
}

function use12hFormat(flag, object) {
    if (flag) {
        object['hour'] = convertTo12hFormat(object['hour'])
    }
}

function addLeadingZero(num) {
    if (num < 10) {
        return `"${num.toString().padStart(2, '0')}"`
    }

    return `"${num}"`
}

function showLeadingZero(flag, object, elements) {
    if (flag) {
        changeable_format_elements.map((element_name) => {
            object[element_name] = addLeadingZero(object[element_name])
            if (elements[element_name].type !== 'string') {
                elements[element_name].type = 'string'
            }
        })
    } else {
        changeable_format_elements.map((element_name) => {
            if (elements[element_name].type !== 'number') {
                elements[element_name].type = 'number'
            }
        })
    }
}

function getVisibleElementsOrderedList(elements) {
    const elements_list = Object.entries(elements)

    let result = []
    for (let i = 0; i < elements_list.length; i++) {
        for (let j = 0; j < elements_list.length; j++) {
            if ((i === elements_list[j][1].order) && elements_list[j][1].visibility) {
                result.push(elements_list[j][0])
            }
        }
    }

    return result
}

function createClockElement(element_name, object, elements, comma_flag = true) {
    const element = document.createElement('p')
    element.id = element_name
    element.classList.add('tab', 'on')
    element.innerHTML = `<span class="object-key">${element_name}</span>: <span id="${element_name}_value" class="${elements[element_name].type}">${object[element_name].toString()}</span><span class="comma">,</span>`
    if (!comma_flag) {
        element.getElementsByClassName('comma')[0].remove()
    }

    return element
}

function createClockElements(object, elements, ordered_list) {
    const last_element = ordered_list.slice(-1)[0]
    let result = []
    ordered_list.map((element_name) => {
        if (element_name !== last_element) {
            result.push(createClockElement(element_name, object, elements))
        } else {
            result.push(createClockElement(element_name, object, elements, false))
        }
    })

    return result
}

function createClock(object, settings) {
    const result = []

    const keyword = settings.format.use_const_declaration ? possible_declarations[1] : possible_declarations[0]
    const start = document.createElement('p')
    start.innerHTML = `<span class="keyword">${keyword}</span> <span class="local-variable">clock</span> <span class="operator">=</span> <span class="bracket">{</span>`
    result.push(start)

    const elements = settings.visibility.customization.enable ? settings.clock.elements : default_settings.clock.elements
    use12hFormat(settings.format.use_12h_format, object);
    showLeadingZero(settings.format.show_leading_zero, object, elements)
    const ordered_list = getVisibleElementsOrderedList(elements)
    const clock_elements = createClockElements(object, elements, ordered_list)
    result.push(...clock_elements)

    const end = document.createElement('p')
    end.innerHTML = `<span class="bracket">}</span>;`
    result.push(end)

    return result
}

function updateClockDOM(object, settings) {
    document.getElementById('object_clock').replaceChildren(...createClock(object, settings))
}

function changePosition(settings) {
    const position = settings.position.customization.enable ? settings.position : default_settings.position
    const x = position.x
    const y = position.y

    document.body.style.justifyContent = x
    document.body.style.alignItems = y
}

function changeFontSize({size}) {
    document.body.style.fontSize = size + "px"
}

function changeFontFamily({family}) {
    document.body.style.fontFamily = family
}

function changeTheme(settings) {
    const theme = settings.theme
    const font = theme.customization.enable ? settings.font : default_settings.font

    changeFontFamily(font)

    const link = document.querySelectorAll('link')[1]
    if (link.getAttribute('href') !== themes[theme.name]) {
        link.setAttribute('href', themes[theme.name])
    }
}

function updateClock(object, settings) {
    object = new Clock()

    changeFontSize(settings.font)

    changePosition(settings)

    changeTheme(settings)

    updateClockDOM(object, settings)
}

export {Clock, Settings, updateClock}