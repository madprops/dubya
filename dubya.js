#!/usr/bin/node
const execSync = require('child_process').execSync

const Dub = {}

// Shift
Dub.copy_key = 54
// Control
Dub.paste_key = 3613

// Used to compare two taps
Dub.last_copy_tap_date = 0
Dub.last_paste_tap_date = 0

// Taps have to happen before these
// milliseconds
Dub.limit = 300

// Key input listener
Dub.start_hook = function (on_keydown) {
  const ioHook = require('iohook')
  ioHook.on("keyup", on_keydown)

  process.on('exit', () => {
    ioHook.unload()
  })

  ioHook.start()
}

Dub.focus = function () {
  let id = execSync('xdotool getmouselocation --shell 2>/dev/null | grep WINDOW')
            .toString().replace(/\D+/g, '').trim()
  execSync(`wmctrl -i -a ${id}`)
}

Dub.copy = function () {
  Dub.focus()
  setTimeout(() => {
    execSync("xdotool key Control_L+c")   
  }, 100)
}

Dub.paste = function () {
  execSync("xdotool key Control_L+v")
}

Dub.copy_tap = function () {
  let now = Date.now()

  if (now - Dub.last_copy_tap_date < Dub.limit) {
    Dub.copy()
    Dub.last_copy_tap_date = 0
    console.log("Copied.")
  } else {
    Dub.last_copy_tap_date = now
  }
}

Dub.paste_tap = function () {
  let now = Date.now()

  if (now - Dub.last_paste_tap_date < Dub.limit) {
    Dub.paste()
    Dub.last_paste_tap_date = 0
    console.log("Pasted.")
  } else {
    Dub.last_paste_tap_date = now
  }
}

Dub.init = function () {
  Dub.start_hook(function (e) {
    if (e.keycode == Dub.copy_key) {
      Dub.copy_tap()
    } else if (e.keycode == Dub.paste_key) {
      Dub.paste_tap()
    }
  })
}

Dub.init()