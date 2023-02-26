var socket;


function leave_room() {
    socket.emit('left', {}, function() {
        socket.disconnect();
        // go back to the login page
        window.location.href = "/";
    });
}


$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    socket.on('connect', function() {
        socket.emit('join', {});
    });
    socket.on('status', function(data) {
        $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    socket.on('message', function(data) {
        data_msg = data.msg;
        user_name = '';
        data_msg_one = '';
        pointer = true;
        pointer_one = true;
        for (let i = 0 ; i < data_msg.length ; i++) {
            if (data_msg[i] == ":"){
                pointer = false;
            }
            if (pointer_one == true){

               if (pointer == true) {
                user_name = user_name + data_msg[i];
                }
                else {
                    user_name = user_name + ': ';
                    pointer_one = false;
                }
            }
            else {
                data_msg_one = data_msg_one + data_msg[i];
            }
        }
        data_msg_one = encrypted_message_to_array(data_msg_one);
        data_msg_one = undo_encryption_array(data_msg_one);
        data_msg = user_name + data_msg_one;




        $('#chat').val($('#chat').val() + data_msg + '\n');
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
    $('#send').click(function(e) {
            normal_message = $('#text').val();
            normal_message_two = normal_message;
            normal_message_two = functions(normal_message_two);

            text = normal_message_two;
            $('#text').val('');
            if (text != null && text != '') {
                socket.emit('text', {msg: text});
            }
    });
});

let functions = function(message_one){

    message_two = message_one;
    message_two = string_to_chars(message_two);
    message_two = chars_to_pieces(message_two);
    message_two = add_random_place(message_two);
    message_two = encrypt_array(message_two);
    return message_two;
}



let random_number = function(start, range) {
    let get_random = Math.floor((Math.random() * range) + start);
    while (get_random > range) {
        get_random = Math.floor((Math.random() * range) + start);
    }
    return get_random;
}

let random_place = function() {
    x = random_number(1,8);
    y = random_number(0,8);
    place = String(chars[y]) + String(x);
    return place;
}
chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

lowercase_letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
                     's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
uppercase_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                     'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

b = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
B = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
k = ['k', 'l', 'm'];
K = ['K', 'L', 'M'];
n = ['n', 'o'];
N = ['N', 'O'];
p = ['p'];
P = ['P'];
q = ['q', 'a'];
Q = ['Q', 'A'];
r = ['r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
R = ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

uppercase_chess_pieces = [B, K, N, P, Q, R];
lowercase_chess_pieces = [b, k, n, p, q, r];

numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
string_numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
encrypted_numbers = ['k', 'p', 'y', 'e', 'a', 'z', 'w', 'm', 'f', 'l'];


let string_to_chars = function(text) {

    message_chars = [];
    for (let i = 0; i < text.length; i++) {
            message_chars.push(text[i]);
    }
    return message_chars;
}

let chars_to_chess_pieces_letter = function(letter) {

    upper = false;
    lower = false;

    for (let i = 0; i < lowercase_letters.length; i++) {
        if (letter == lowercase_letters[i]){
            lower = true;
        }
        if (letter == uppercase_letters[i]){
            upper = true;
        }
    }

    if (lower == true) {
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            for (let j = 0; j < lowercase_chess_pieces[i].length; j++) {
                if (letter == lowercase_chess_pieces[i][j]) {
                    return (lowercase_chess_pieces[i][0] + String(j));
                }
            }
        }
    }
    if (upper == true) {
        for (let i = 0; i < uppercase_chess_pieces.length; i++) {
            for (let j = 0; j < uppercase_chess_pieces[i].length; j++) {
                if (letter == uppercase_chess_pieces[i][j]) {
                    return (uppercase_chess_pieces[i][0] + String(j));
                }
            }
        }
    }


}


let chars_to_chess_pieces_number = function(num) {

    letter = encrypted_numbers[num]
    for (let i = 0; i < lowercase_chess_pieces.length; i++) {
        for (let j = 0; j < lowercase_chess_pieces[i].length; j++) {
            if (letter == lowercase_chess_pieces[i][j]) {
                return (String(j) + lowercase_chess_pieces[i][0]);
            }
        }
    }

}


let chars_to_pieces = function(array) {

    array_two = [];
    for (let i = 0; i< array.length; i++) {
        is_num = false;
        is_letter = false;

        for (let j = 0; j< numbers.length; j++) {
            if (numbers[j] == array[i]) {
                is_num = true;
            }
        }
        for (let j = 0; j< lowercase_letters.length; j++) {
            if (lowercase_letters[j] == array[i]) {
                is_letter = true;
            }
        }
        for (let j = 0; j< uppercase_letters.length; j++) {
            if (uppercase_letters[j] == array[i]) {
                is_letter = true;
            }
        }


        if (array[i] == ' ') {
            array_two.push('9');
        }
        else if (is_letter == true) {
            array_two.push(chars_to_chess_pieces_letter(array[i]));
        }
        else if (is_num == true) {
            array_two.push(chars_to_chess_pieces_number(array[i]));
        }
        else {
            array_two.push(array[i]);
        }
    }
    return (array_two);

}

let add_random_place = function(array) {

    array_two = [];

    for (let i = 0; i<array.length; i++) {

        is_num = false;
        is_letter = false;

        for (let j = 0; j< numbers.length; j++) {
            if (numbers[j] == array[i][0]) {
                is_num = true;
            }
        }
        for (let j = 0; j< lowercase_letters.length; j++) {
            if (lowercase_letters[j] == array[i][0]) {
                is_letter = true;
            }
        }
        for (let j = 0; j< uppercase_letters.length; j++) {
            if (uppercase_letters[j] == array[i][0]) {
                is_letter = true;
            }
        }

        if (array[i] == '9') {
            array_two.push('9');
        }
        else if (is_num == true || is_letter == true) {
            place = random_place();
            array[i] += place;
            array_two.push(array[i]);
        }
        else {
            array_two.push(array[i]);
        }
    }
   return array_two;
}

let encrypt_slot = function(text) {

    encrypted_text = '';
    is_upper = false;
    is_lower = false;
    is_num = false;

    for (let j = 0; j< numbers.length; j++) {
        if (numbers[j] == text[0]) {
            for (let q = 0; q< lowercase_letters.length; q++) {
                if (lowercase_letters[q] == text[1]) {
                    is_num = true;
                }
            }
        }
    }
    for (let j = 0; j< lowercase_letters.length; j++) {
        if (lowercase_letters[j] == text[0]) {
            is_lower = true;
        }
    }
    for (let j = 0; j< uppercase_letters.length; j++) {
        if (uppercase_letters[j] == text[0]) {
            is_upper = true;
        }
    }

    if (is_lower == true) {


        piece_and_place = text;

        piece_letter_value = "";
        piece_letter_value_temp = "";
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_and_place[0]) {
                piece_letter_value = String(i);
                piece_letter_value_temp = lowercase_chess_pieces[i][0];
            }
        }
        piece_number_value = piece_and_place[1];
        place_letter_value = String(parseInt(chars.indexOf(piece_and_place[2])));
        place_number_value = piece_and_place[3];
        piece_letter_value = lowercase_chess_pieces[(parseInt(place_letter_value) + parseInt(piece_letter_value)) % 6][0];

        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value_temp) {
                piece_number_value = String((parseInt(piece_number_value) + parseInt(place_number_value)) % lowercase_chess_pieces[i].length);
            }
        }
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value) {
                place_letter_value = chars[(chars.indexOf(piece_and_place[2]) + i) % 8];
            }
        }
        place_number_value = String((( parseInt(piece_number_value) + parseInt(piece_and_place[3])) % 8));
        if (place_number_value == '0') {
            place_number_value = '8';
        }


        new_piece = piece_letter_value + piece_number_value + place_letter_value + place_number_value;
        return (new_piece);

    }
    else if (is_upper == true) {


        piece_and_place = text;

        for( let i = 0 ; i < uppercase_letters.length ; i++) {
            if (piece_and_place[0] == uppercase_letters[i]){
                piece_and_place = lowercase_letters[i] + piece_and_place[1] + piece_and_place[2] + piece_and_place[3];
            }
        }

        piece_letter_value = "";
        piece_letter_value_temp = "";
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_and_place[0]) {
                piece_letter_value = String(i);
                piece_letter_value_temp = lowercase_chess_pieces[i][0];
            }
        }
        piece_number_value = piece_and_place[1];
        place_letter_value = String(parseInt(chars.indexOf(piece_and_place[2])));
        place_number_value = piece_and_place[3];
        piece_letter_value = lowercase_chess_pieces[(parseInt(place_letter_value) + parseInt(piece_letter_value)) % 6][0];

        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value_temp) {
                piece_number_value = String((parseInt(piece_number_value) + parseInt(place_number_value)) % lowercase_chess_pieces[i].length);
            }
        }
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value) {
                place_letter_value = chars[(chars.indexOf(piece_and_place[2]) + i) % 8];
            }
        }
        place_number_value = String((( parseInt(piece_number_value) + parseInt(piece_and_place[3])) % 8));
        if (place_number_value == '0') {
            place_number_value = '8';
        }

        for(let i = 0 ; i < lowercase_letters.length ; i++){
            if (piece_letter_value == lowercase_letters[i]){
                piece_letter_value = uppercase_letters[i];
            }
        }

        new_piece = piece_letter_value + piece_number_value + place_letter_value + place_number_value;
        return (new_piece);

    }
    else if (is_num == true) {


        piece_and_place = text[1]+text[0]+text[2]+text[3];

        piece_letter_value = "";
        piece_letter_value_temp = "";
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_and_place[0]) {
                piece_letter_value = String(i);
                piece_letter_value_temp = lowercase_chess_pieces[i][0];
            }
        }
        piece_number_value = piece_and_place[1];
        place_letter_value = String(parseInt(chars.indexOf(piece_and_place[2])));
        place_number_value = piece_and_place[3];
        piece_letter_value = lowercase_chess_pieces[(parseInt(place_letter_value) + parseInt(piece_letter_value)) % 6][0];

        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value_temp) {
                piece_number_value = String((parseInt(piece_number_value) + parseInt(place_number_value)) % lowercase_chess_pieces[i].length);
            }
        }
        for (let i = 0; i < lowercase_chess_pieces.length; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value) {
                place_letter_value = chars[(chars.indexOf(piece_and_place[2]) + i) % 8];
            }
        }
        place_number_value = String((( parseInt(piece_number_value) + parseInt(piece_and_place[3])) % 8));
        if (place_number_value == '0') {
            place_number_value = '8';
        }

        new_piece = piece_number_value + piece_letter_value + place_letter_value + place_number_value;
        return (new_piece);

    }
    else if (text == '9'){
        return ('9');
    }
    else {
        return (text);
    }


}

let encrypt_array = function(array) {

    encrypted_message = '';
    for (let i = 0; i < array.length; i++) {
        encrypted_message = encrypted_message + encrypt_slot(array[i]);
    }
    return (encrypted_message);

}

let encrypted_message_to_array = function(text) {
    check_numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
    array_two = [];
    array_three = [];
    msg1 = text;
    msg2 = "";
    for (let i = 0 ; i < msg1.length ; i++) {

        is_num = false;
        is_letter = false;
        for (let j = 0 ; j < check_numbers.length ; j++) {
            if (msg1[i] == check_numbers[j]) {
                is_num = true;
            }
        }
        for (let j = 0 ; j < lowercase_letters.length ; j++) {
            if (msg1[i] == lowercase_letters[j]) {
                is_letter = true;
            }
        }
        if (is_letter == false) {
            for (let j = 0 ; j < uppercase_letters.length ; j++) {
                if (msg1[i] == uppercase_letters[j]) {
                    is_letter = true;
                }
            }
        }
        if (is_letter == false && is_num == false){
            msg2 = msg2 + msg1[i] + msg1[i] + msg1[i] + msg1[i]
        }
        else {
            msg2 = msg2 + msg1[i];
        }



    }
    counter = 0;
    for (let i = 0 ; i < msg2.length ; i = i + 4) {
        array_two.push(msg2[i]);
        for (let j = 1 ; j < 4 ; j++){
            array_two[counter] = array_two[counter] + msg2[i+j];
        }
        counter++;
    }

    for (let i = 0 ; i < array_two.length ; i++) {
        if (array_two[i][0] == array_two[i][1]) {
            array_three.push(array_two[i][0]);
        }
        else {
            array_three.push(array_two[i])
        }
    }
    for (let i = 0 ; i < array_three.length ; i++) {
        if (array_three[i] == '9') {
            array_three[i] = ' ';
        }
    }
    return array_three;
}

let undo_encryption_array = function(array) {

    array_two = "";
    for (let i = 0 ; i < array.length ; i++) {
        if (array[i].length > 1) {
            array_two = array_two + undo_encryption_slot(array[i]);
        }
        else {
            array_two = array_two + array[i];
        }
    }
    return array_two;
}

let undo_encryption_slot = function(text) {

    is_num = false;
    is_lower = false;
    is_upper = false;
    piece_and_place = '';
    encrypted_message = String(text);


    for (let i = 0 ; i < string_numbers.length ; i++) {
        if (encrypted_message[0] == string_numbers[i]) {
            is_num = true;
        }
    }

    for (let i = 0 ; i < lowercase_letters.length ; i++) {
        if (encrypted_message[0] == lowercase_letters[i]) {
            is_lower = true;
        }
    }

    for (let i = 0 ; i < uppercase_letters.length ; i++) {
        if (encrypted_message[0] == uppercase_letters[i]) {
            is_upper = true;
        }
    }

    if (is_lower == true) {

        letter = '';


        piece_letter_value = encrypted_message[0];
        piece_number_value = encrypted_message[1];
        place_letter_value = encrypted_message[2];
        place_number_value = encrypted_message[3];


        place_number_value = ((parseInt(place_number_value) - parseInt(piece_number_value)  +24) % 8);
        if (place_number_value == 0) {
            place_number_value = 8;
        }
        pointer = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if ( lowercase_chess_pieces[i][0] == piece_letter_value && pointer == true) {
                place_letter_value = chars[(chars.indexOf(place_letter_value) - i +24)%8];
                pointer = false
            }
        }
        pointer_one = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value && pointer_one == true) {
                piece_letter_value = lowercase_chess_pieces[(i - chars.indexOf(place_letter_value) +24)%6][0];
                pointer_one = false;
            }
        }
        pointer_two = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value && pointer_two == true) {
                piece_number_value = ((parseInt(piece_number_value) - parseInt(place_number_value)) + (lowercase_chess_pieces[i].length * 10)) % lowercase_chess_pieces[i].length;
                letter = lowercase_chess_pieces[i][piece_number_value];
                return letter;
                pointer_two = false;
            }
        }




    }
    else if (is_upper == true) {
        encrypted_message_temp = text;
        encrypted_message = '';
        for (let i = 0 ; i < uppercase_letters.length ; i++) {
            if (encrypted_message_temp[0] == uppercase_letters[i]) {
                encrypted_message = lowercase_letters[i] + encrypted_message_temp[1] + encrypted_message_temp[2] + encrypted_message_temp[3];
            }
        }

        piece_letter_value = encrypted_message[0];
        piece_number_value = encrypted_message[1];
        place_letter_value = encrypted_message[2];
        place_number_value = encrypted_message[3];


        place_number_value = ((parseInt(place_number_value) - parseInt(piece_number_value)  +24) % 8);
        if (place_number_value == 0) {
            place_number_value = 8;
        }
        pointer = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if ( lowercase_chess_pieces[i][0] == piece_letter_value && pointer == true) {
                place_letter_value = chars[(chars.indexOf(place_letter_value) - i +24)%8];
                pointer = false
            }
        }
        pointer_one = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value && pointer_one == true) {
                piece_letter_value = lowercase_chess_pieces[(i - chars.indexOf(place_letter_value) +24)%6][0];
                pointer_one = false;
            }
        }
        pointer_two = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value && pointer_two == true) {
                piece_number_value = (parseInt(piece_number_value) - parseInt(place_number_value) + (lowercase_chess_pieces[i].length * 10)) % lowercase_chess_pieces[i].length;
                letter = lowercase_chess_pieces[i][piece_number_value];
                return (uppercase_letters[lowercase_letters.indexOf(letter)]);
                pointer_two = false;
            }
        }


    }
    else if (is_num == true) {
        piece_letter_value = encrypted_message[1];
        piece_number_value = encrypted_message[0];
        place_letter_value = encrypted_message[2];
        place_number_value = encrypted_message[3];

        place_number_value = ((parseInt(place_number_value) - parseInt(piece_number_value)  +24) % 8);
        if (place_number_value == 0) {
            place_number_value = 8;
        }
        pointer = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if ( lowercase_chess_pieces[i][0] == piece_letter_value && pointer == true) {
                place_letter_value = chars[(chars.indexOf(place_letter_value) - i +24)%8];
                pointer = false
            }
        }
        pointer_one = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value && pointer_one == true) {
                piece_letter_value = lowercase_chess_pieces[(i - chars.indexOf(place_letter_value) +24)%6][0];
                pointer_one = false;
            }
        }
        pointer_two = true;
        for (let i = 0 ; i < lowercase_chess_pieces.length ; i++) {
            if (lowercase_chess_pieces[i][0] == piece_letter_value && pointer_two == true) {
                piece_number_value = (parseInt(piece_number_value) - parseInt(place_number_value) + (lowercase_chess_pieces[i].length * 10)) % lowercase_chess_pieces[i].length;
                letter = lowercase_chess_pieces[i][piece_number_value];
                return (encrypted_numbers.indexOf(letter));
                pointer_two = false;
            }
        }


    }
    else {
        return 'error';
    }
}






