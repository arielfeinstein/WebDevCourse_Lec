let userObj = {
    username: 'arielfainshtein',
    grade: 85,
    password: 'pass123',
    isConnected: true,
    addr: {
        country: 'Israel',
        city: 'Haifa',
        street: 'Herzel',
        number: 10
    },
    allGrades: [{ cSharp: 80 }, { cpp: 70 }, 90, 100, 85]
}

let newGrade = userObj.grade + 10;
userObj.grade += 10;
userObj.id = 1000; // creates a new property

let userObj2 = userObj; // reference to the same object
userObj2.grade = 0; // modifies the original object
let grade1 = userObj2.grade;

console.log(userObj);
console.log(userObj2);

// clone
let userObj3 = { ...userObj }; // shallow copy 
userObj3.grade = 50;

userObj3.addr.street = '';

let arr =
    [
        userObj,
        {
            username: 'arielfainshtein',
            grade: 85,
            password: 'pass123',
            isConnected: true,
            addr: {
                country: 'Israel',
                city: 'Haifa',
                street: 'Herzel',
                number: 10
            },
            allGrades: [{ cSharp: 80 }, { cpp: 70 }, 90, 100, 85]
        }
    ];

arr[0].allGrades[1] = { CPP: 80 };