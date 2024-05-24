// Function to calculate grade based on join date
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

// Fetch the JSON data from the members.json file
fetch('members.json')
    .then(response => response.json())
    .then(data => {
        // Get the table element
        const table = document.getElementById('members-table');

        // Iterate over each member in the data
        data.forEach(member => {
            // Only display the member if they meet the conditions
            if (shouldDisplay(member)) {
                // Create a new row
                const row = document.createElement('tr');

                // Create cells for each property
                const nameCellJapanese = document.createElement('td');
                nameCellJapanese.textContent = member.name.lastNameJapanese + ' ' + member.name.firstNameJapanese;
                row.appendChild(nameCellJapanese);

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

                const roomCell = document.createElement('td');
                roomCell.textContent = member.roomNumber;
                row.appendChild(roomCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = member.email;
                row.appendChild(emailCell);

                // Add the row to the table
                table.appendChild(row);
            }
        });
    })
    .catch(error => console.error('Error:', error));