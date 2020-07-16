#!/usr/bin/node
const execSync = require('child_process').execSync

const Dub = {}
Dub.copy_key = 3676
Dub.paste_key = 54
Dub.last_copy_tap_date = 0
Dub.last_paste_tap_date = 0
Dub.limit = 300

Dub.start_hook = function (on_keydown) {
  const ioHook = require('iohook')
  ioHook.on("keyup", on_keydown)

  process.on('exit', () => {
    ioHook.unload()
  })

  ioHook.start()
}

Dub.copy = function () {
  execSync("xdotool key ctrl+c")
}

Dub.paste = function () {
  execSync("xdotool key ctrl+v")
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