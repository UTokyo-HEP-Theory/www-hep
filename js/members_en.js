// phone number for each room 
const roomPhoneNumbers = {
    911: 4137,
    920: 4139,
    921: 4138
};

// デフォルトの email ドメイン
const defaultDomain = 'hep-th.phys.s.u-tokyo.ac.jp';

// Function to calculate numerical grade based on join date
function calculateGradeNum(joinYear, joinMonth) {
    // デバッグ用クエリパラメータの取得
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');

    // デバッグ用クエリパラメータの日付を優先する
    const currentDate = dateParam ? new Date(dateParam) : new Date();

    let grade = currentDate.getFullYear() - Number(joinYear) + 1;
    if (currentDate.getMonth() + 1 < Number(joinMonth)) {
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

    // if the join date is in the future return false
    if (member.period.join !== null && member.period.join !== undefined) {
        if (Number(member.period.join.year) > currentYear ||
            (Number(member.period.join.year) === currentYear && Number(member.period.join.month) > currentMonth)) {
            return false;
        }
    }

    // if the leave date is in the past return false
    if (member.period.leave !== null && member.period.leave !== undefined) {
        const leaveYear = parseInt(member.period.leave.year, 10);
        const leaveMonth = parseInt(member.period.leave.month, 10);
        if (leaveYear < currentYear ||
            (leaveYear === currentYear && leaveMonth < currentMonth)) {
            return false;
        }
    }


    // Check if the member has no position and is in grade 6 or above
    if (member.position === null) {
        const grade = calculateGradeNum(Number(member.period.join.year), Number(member.period.join.month));
        if (grade >= 6) {
            return false;
        }
    }

    // If none of the above conditions are met, display the member
    return true;
}

// Function to copy text to the clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        function() {
            console.log('Successfully copied to clipboard');
        },
        function(err) {
            console.error('Failed to copy to clipboard', err);
        }
    );
}


// Function to show notification when text is copied
function showNotification(notificationElement) {
    // Hide any visible notification
    document.querySelectorAll('.notification.visible').forEach(element => {
        element.classList.remove('visible');
    });

    // Show the current notification
    notificationElement.classList.add('visible');

    // Hide current notification after 2 seconds
    setTimeout(() => {
        notificationElement.classList.remove('visible');
    }, 2000);
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

            // Not display name in Japanese for english version
             // Create cells for each property
             //const nameCellJapanese = document.createElement('td');
             //nameCellJapanese.textContent = member.name.lastNameJapanese + ' ' + member.name.firstNameJapanese;
             //row.appendChild(nameCellJapanese);

            // If the member has websites, add a link emoji for each one

            const nameCellEnglish = document.createElement('td');
            nameCellEnglish.textContent = member.name.firstName + ' ' + member.name.lastName;
            row.appendChild(nameCellEnglish);


            // For English version the link is shown next to (English) name.
            if (member.websites) {
                member.websites.forEach(website => {
                    const link = document.createElement('a');
                    link.href = website;
                    link.textContent = ' 🔗';
                    link.style.textDecoration = 'none';
                    nameCellEnglish.appendChild(link);
                });
            }

            const positionCell = document.createElement('td');
            if (member.position === null) {
                positionCell.textContent = calculateGrade(member.period.join.year, member.period.join.month);
            } else {
                //positionCell.textContent = member.position.japanese;
                positionCell.textContent = member.position.english;
            }
            row.appendChild(positionCell);

            // room number
            const roomCell = document.createElement('td');
            roomCell.textContent = member.roomNumber;
            row.appendChild(roomCell);

            // phone number
            const phoneCell = document.createElement('td');
            if ((member.phone !== null) && (member.phone !== undefined)) {
                phoneCell.textContent = member.phone;
            } else if (roomPhoneNumbers.hasOwnProperty(member.roomNumber)) {
                phoneCell.textContent = roomPhoneNumbers[member.roomNumber];
            } else {
                phoneCell.textContent = '';
            }
            row.appendChild(phoneCell);

            // email
            const emailCell = document.createElement('td');
            const emailDomain = member.email_domain || defaultDomain;
            const email = `${member.email}@${emailDomain}`;
            const displayEmail = member.email + (emailDomain === defaultDomain ? '' : `_at_${emailDomain}`);
            emailCell.innerHTML = `
            <div class="clipboard-container">
                <span class="clipboard-icon" style="cursor: pointer;">📋</span>
                <div class="notification">Copied!</div>
            </div>
            <span>${displayEmail}</span>
        `;

            const clipboardIcon = emailCell.querySelector('.clipboard-icon');
            const notificationElement = emailCell.querySelector('.notification');

            clipboardIcon.addEventListener('click', () => {
                copyToClipboard(email);
                showNotification(notificationElement);
            });

            row.appendChild(emailCell);

           // //email
           // const emailCell = document.createElement('td');
           // if (member.email_domain !== null && member.email_domain !== undefined) {
           //     emailCell.textContent = `${member.email}_at_${member.email_domain}`;
           // } else {
           //     emailCell.textContent = member.email;
           // }
           // row.appendChild(emailCell);

            // Add the row to the table
            table.appendChild(row);
        }
    });
})
    .catch(error => console.error('Error:', error));