// 各居室の電話番号を格納する辞書
const roomPhoneNumbers = {
    911: 4137,
    920: 4139,
    921: 4138
};

// Function to calculate numerical grade based on join date
function calculateGradeNum(joinYear, joinMonth) {
    // デバッグ用クエリパラメータの取得
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');

    // デバッグ用クエリパラメータの日付を優先する
    const currentDate = dateParam ? new Date(dateParam) : new Date();
    let grade = currentDate.getFullYear() - joinYear;
    if (currentDate.getMonth() + 1 < joinMonth) {
        grade--;
    }
    return grade;
}

// Function to calculate the string representing grade based on calculateGradeNum. 
function calculateGrade(joinYear, joinMonth) {
    const grade = calculateGradeNum(joinYear, joinMonth)
    if (grade <= 2) {
        return "M" + grade;
    } else {
        return "D" + (grade - 2);
    }
}

// Function to check if a member should be displayed
function shouldDisplay(member) {

    //exclude field
    if (member.exclude) {
        return false;
    }

    // デバッグ用クエリパラメータの取得
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');

    // デバッグ用クエリパラメータの日付を優先する
    const currentDate = dateParam ? new Date(dateParam) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

    // Check if the leave date is in the past
    if (member.period.leave !== null) {
        if (member.period.leave.year < currentYear ||
            (member.period.leave.year === currentYear && member.period.leave.month < currentMonth)) {
            return false;
        }
    }

    // Check if the member has no position and is in grade 6 or above
    if (member.position === null) {
        const grade = calculateGradeNum(member.period.join.year, member.period.join.month);
        if (grade >= 6) {
            return false;
        }
    }

    // If none of the above conditions are met, display the member
    return true;
}

// ファイルのリスト
//const files = ['data/staff.json', 'data/postdoc.json', 'data/students.json'];
const files = ['../data/staffs.json','../data/postdocs.json','../data/students.json'];

// 各ファイルを非同期に読み込む
const promises = files.map(file => fetch(file).then(response => response.json()));

// 全てのファイルが読み込まれたら
Promise.all(promises).then(data => {
    // Get the table element
    const table = document.getElementById('members-table');

    // Flatten the array of arrays into a single array
    const allMembers = [].concat(...data);

    // Iterate over each member in the data
    allMembers.forEach(member => {
        // Only display the member if they meet the conditions
        if (shouldDisplay(member)) {
            // Create a new row
            const row = document.createElement('tr');

            // Create cells for each property
            const nameCellJapanese = document.createElement('td');
            nameCellJapanese.textContent = member.name.lastNameJapanese + ' ' + member.name.firstNameJapanese;
            row.appendChild(nameCellJapanese);

            // If the member has websites, add a link emoji for each one
            if (member.websites) {
                member.websites.forEach(website => {
                    const link = document.createElement('a');
                    link.href = website;
                    link.textContent = ' 🔗';
                    link.style.textDecoration = 'none';
                    nameCellJapanese.appendChild(link);
                });
            }

            const nameCellEnglish = document.createElement('td');
            nameCellEnglish.textContent = member.name.firstName + ' ' + member.name.lastName;
            row.appendChild(nameCellEnglish);

            const positionCell = document.createElement('td');
            if (member.position === null) {
                positionCell.textContent = calculateGrade(member.period.join.year, member.period.join.month);
            } else {
                positionCell.textContent = member.position.japanese;
            }
            row.appendChild(positionCell);

            // room number

            const roomCell = document.createElement('td');
            roomCell.textContent = member.roomNumber;
            row.appendChild(roomCell);

            //phone number 
            const phoneCell = document.createElement('td');
            if ((member.phone !== null) && (member.phone !== undefined)) {
                phoneCell.textContent = member.phone;
            } else if (roomPhoneNumbers.hasOwnProperty(member.roomNumber)) {
                phoneCell.textContent = roomPhoneNumbers[member.roomNumber];
            } else {
                phoneCell.textContent = '';
            }
            row.appendChild(phoneCell);

            //email
            const emailCell = document.createElement('td');
            if (member.email_domain !== null && member.email_domain !== undefined) {
                emailCell.textContent = `${member.email}_at_${member.email_domain}`;
            } else {
                emailCell.textContent = member.email;
            }
            row.appendChild(emailCell);

            // Add the row to the table
            table.appendChild(row);
        }
    });
})
    .catch(error => console.error('Error:', error));