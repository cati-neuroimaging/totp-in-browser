var interval;
const storage_key = 'totpCodes'

function read_totp() {
    let totpCodes = localStorage.getItem(storage_key);
    if (totpCodes) {
        totpCodes = JSON.parse(totpCodes);
    }
    return totpCodes;
}

function write_totp(totpCodes) {
    localStorage.setItem(storage_key, JSON.stringify(totpCodes));
}


function submit(event) {
    try {
        let identifier = event.currentTarget.elements.identifier.value;
        let totpCode = event.currentTarget.elements.totpCode.value;
        if (identifier && totpCode) {
            // Check that code is valid for totp
            let totp = new jsOTP.totp();
            totp.getOtp(totpCode);
            // Store the TOTP code in local storage
            let totpCodes = read_totp();
            if (!totpCodes) {
                totpCodes = {};
            }
            totpCodes[identifier] = totpCode;
            write_totp(totpCodes);
            // Reload page to display updated codes
            location.reload(false);
        }
    }
    finally {
        // Do not submit the form
        event.preventDefault();
    }
}

function clear(event) {
    localStorage.removeItem(storage_key);
    if (interval) {
        window.clearInterval(interval);
    }
    location.reload(false);
}

function remove_code(id) {
    let totpCodes = read_totp();
    if (totpCodes) {
        delete totpCodes[id];
        write_totp(totpCodes);
    }
    // Reload page to display updated codes
    location.reload(false);
}

function remove_button(button) {
    remove_code(button.name);
}

function update_codes(event) {
    let totp = new jsOTP.totp();
    let totpCodes = read_totp()
    let html = '';
    for (id in totpCodes) {
        let code = totp.getOtp(totpCodes[id]);
        html += id + " : <b>" + code + '</b> <button name="' + escape(id) + '" onclick="remove_button(this);"><font color="red">x</font></button><br>\n';
    }
    let codes = document.getElementById('codes');
    if (codes.innerHTML != html) {
        codes.innerHTML = html;
    }
}
