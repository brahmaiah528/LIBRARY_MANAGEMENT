const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const IssuedBook = require('./models/IssuedBook');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('Clearing existing database records...');
    await User.deleteMany({});
    await Book.deleteMany({});
    await IssuedBook.deleteMany({});

    console.log('Seeding Users...');

    // 1. Default Admin
    const adminUser = await User.create({
      name: 'Dr. Robert Vance (Admin)',
      email: 'admin@library.com',
      phone: '+1 (555) 019-2831',
      department: 'Library Administration',
      registerNumber: 'ADM-001',
      role: 'Admin',
      password: 'Admin@123',
    });

    // 2. Default Student
    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@library.com',
      phone: '+1 (555) 392-8102',
      department: 'Computer Science & Engineering',
      registerNumber: 'CS-2024-042',
      role: 'Student',
      password: 'Student@123',
    });

    // 3. Additional Students
    const student2 = await User.create({
      name: 'Sophia Williams',
      email: 'sophia.w@university.edu',
      phone: '+1 (555) 882-1920',
      department: 'Information Technology',
      registerNumber: 'IT-2024-019',
      role: 'Student',
      password: 'Student@123',
    });

    const student3 = await User.create({
      name: 'Marcus Chen',
      email: 'marcus.chen@university.edu',
      phone: '+1 (555) 412-9011',
      department: 'Electrical Engineering',
      registerNumber: 'EE-2024-105',
      role: 'Student',
      password: 'Student@123',
    });

    console.log('Seeding Library Books...');
    const books = await Book.insertMany([

      // ─────────────────────────────────────────────
      // COMPUTER SCIENCE (50 books)
      // ─────────────────────────────────────────────
      { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '978-0132350884', publisher: 'Prentice Hall', category: 'Computer Science', quantity: 5, availableCopies: 3, shelfNumber: 'CS-101' },
      { title: 'Introduction to Algorithms (4th Edition)', author: 'Thomas H. Cormen, Charles E. Leiserson', isbn: '978-0262046305', publisher: 'MIT Press', category: 'Computer Science', quantity: 4, availableCopies: 2, shelfNumber: 'CS-102' },
      { title: 'The Art of Computer Programming, Vol 1', author: 'Donald E. Knuth', isbn: '978-0201896831', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 3, availableCopies: 3, shelfNumber: 'CS-103' },
      { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson, Gerald Jay Sussman', isbn: '978-0262510875', publisher: 'MIT Press', category: 'Computer Science', quantity: 4, availableCopies: 2, shelfNumber: 'CS-104' },
      { title: 'Computer Organization and Design', author: 'David Patterson, John Hennessy', isbn: '978-0128201091', publisher: 'Morgan Kaufmann', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-105' },
      { title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen', isbn: '978-0073383095', publisher: 'McGraw-Hill', category: 'Computer Science', quantity: 6, availableCopies: 5, shelfNumber: 'CS-106' },
      { title: 'Compilers: Principles, Techniques, and Tools', author: 'Alfred V. Aho, Monica S. Lam', isbn: '978-0321486813', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-107' },
      { title: 'Programming Language Pragmatics', author: 'Michael L. Scott', isbn: '978-0124104099', publisher: 'Morgan Kaufmann', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-108' },
      { title: 'Data Structures and Algorithm Analysis in C++', author: 'Mark Allen Weiss', isbn: '978-0132847377', publisher: 'Pearson', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-109' },
      { title: 'Algorithm Design', author: 'Jon Kleinberg, Eva Tardos', isbn: '978-0321295354', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 4, availableCopies: 2, shelfNumber: 'CS-110' },
      { title: 'Computer Science: An Overview', author: 'J. Glenn Brookshear', isbn: '978-0133760064', publisher: 'Pearson', category: 'Computer Science', quantity: 5, availableCopies: 5, shelfNumber: 'CS-111' },
      { title: 'Foundations of Computer Science', author: 'Alfred V. Aho, Jeffrey D. Ullman', isbn: '978-0716782841', publisher: 'W. H. Freeman', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-112' },
      { title: 'Theory of Computation', author: 'Michael Sipser', isbn: '978-1133187790', publisher: 'Cengage Learning', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-113' },
      { title: 'Automata Theory, Languages and Computation', author: 'John Hopcroft, Rajeev Motwani', isbn: '978-0321455369', publisher: 'Pearson', category: 'Computer Science', quantity: 4, availableCopies: 4, shelfNumber: 'CS-114' },
      { title: 'The C Programming Language', author: 'Brian W. Kernighan, Dennis M. Ritchie', isbn: '978-0131103627', publisher: 'Prentice Hall', category: 'Computer Science', quantity: 6, availableCopies: 5, shelfNumber: 'CS-115' },
      { title: 'Programming in Python 3', author: 'Mark Summerfield', isbn: '978-0321680563', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 5, availableCopies: 3, shelfNumber: 'CS-116' },
      { title: 'Java: The Complete Reference', author: 'Herbert Schildt', isbn: '978-1260440232', publisher: 'McGraw-Hill', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-117' },
      { title: 'C++ Primer (5th Edition)', author: 'Stanley Lippman, Josée Lajoie', isbn: '978-0321714114', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-118' },
      { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', isbn: '978-0984782857', publisher: 'CareerCup', category: 'Computer Science', quantity: 7, availableCopies: 5, shelfNumber: 'CS-119' },
      { title: 'Programming Pearls', author: 'Jon Bentley', isbn: '978-0201657883', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-120' },
      { title: 'Concrete Mathematics', author: 'Ronald Graham, Donald Knuth', isbn: '978-0201558029', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-121' },
      { title: 'Hacker\'s Delight', author: 'Henry S. Warren Jr.', isbn: '978-0321842688', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 3, availableCopies: 3, shelfNumber: 'CS-122' },
      { title: 'Computational Thinking', author: 'Peter J. Denning, Matti Tedre', isbn: '978-0262536561', publisher: 'MIT Press', category: 'Computer Science', quantity: 4, availableCopies: 4, shelfNumber: 'CS-123' },
      { title: 'Code: The Hidden Language of Computer Hardware', author: 'Charles Petzold', isbn: '978-0735611313', publisher: 'Microsoft Press', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-124' },
      { title: 'Logic and Computer Design Fundamentals', author: 'M. Morris Mano, Charles Kime', isbn: '978-0133798531', publisher: 'Pearson', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-125' },
      { title: 'Digital Design and Computer Architecture', author: 'David Harris, Sarah Harris', isbn: '978-0128000564', publisher: 'Morgan Kaufmann', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-126' },
      { title: 'Introduction to the Theory of Computation', author: 'Michael Sipser', isbn: '978-1133187813', publisher: 'Cengage Learning', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-127' },
      { title: 'Concepts of Programming Languages', author: 'Robert W. Sebesta', isbn: '978-0134997186', publisher: 'Pearson', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-128' },
      { title: 'Functional Programming in Scala', author: 'Paul Chiusano, Runar Bjarnason', isbn: '978-1617290657', publisher: 'Manning', category: 'Computer Science', quantity: 3, availableCopies: 3, shelfNumber: 'CS-129' },
      { title: 'Introduction to Parallel Computing', author: 'Ananth Grama, George Karypis', isbn: '978-0201648652', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-130' },
      { title: 'Graph Theory', author: 'Frank Harary', isbn: '978-0201410334', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 3, availableCopies: 3, shelfNumber: 'CS-131' },
      { title: 'Randomized Algorithms', author: 'Rajeev Motwani, Prabhakar Raghavan', isbn: '978-0521474658', publisher: 'Cambridge University Press', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-132' },
      { title: 'Numerical Recipes: The Art of Scientific Computing', author: 'William H. Press', isbn: '978-0521880688', publisher: 'Cambridge University Press', category: 'Computer Science', quantity: 3, availableCopies: 3, shelfNumber: 'CS-133' },
      { title: 'Introduction to Computing Systems', author: 'Yale N. Patt, Sanjay J. Patel', isbn: '978-0072467505', publisher: 'McGraw-Hill', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-134' },
      { title: 'Head First Java', author: 'Kathy Sierra, Bert Bates', isbn: '978-1491910771', publisher: "O'Reilly Media", category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-135' },
      { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '978-1593279509', publisher: 'No Starch Press', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-136' },
      { title: 'You Don\'t Know JS: Scope & Closures', author: 'Kyle Simpson', isbn: '978-1491904145', publisher: "O'Reilly Media", category: 'Computer Science', quantity: 4, availableCopies: 4, shelfNumber: 'CS-137' },
      { title: 'Learning Python', author: 'Mark Lutz', isbn: '978-1449355739', publisher: "O'Reilly Media", category: 'Computer Science', quantity: 5, availableCopies: 3, shelfNumber: 'CS-138' },
      { title: 'Automate the Boring Stuff with Python', author: 'Al Sweigart', isbn: '978-1593279929', publisher: 'No Starch Press', category: 'Computer Science', quantity: 6, availableCopies: 5, shelfNumber: 'CS-139' },
      { title: 'Think Python', author: 'Allen B. Downey', isbn: '978-1491939369', publisher: "O'Reilly Media", category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-140' },
      { title: 'Effective Java (3rd Edition)', author: 'Joshua Bloch', isbn: '978-0134685991', publisher: 'Addison-Wesley', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-141' },
      { title: 'Introduction to Linear Algebra', author: 'Gilbert Strang', isbn: '978-0980232776', publisher: 'Wellesley-Cambridge Press', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-142' },
      { title: 'Probability and Computing', author: 'Michael Mitzenmacher, Eli Upfal', isbn: '978-1108831918', publisher: 'Cambridge University Press', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-143' },
      { title: 'Computer Science Distilled', author: 'Wladston Ferreira Filho', isbn: '978-0997316025', publisher: 'Code Energy', category: 'Computer Science', quantity: 5, availableCopies: 5, shelfNumber: 'CS-144' },
      { title: 'Grokking Algorithms', author: 'Aditya Y. Bhargava', isbn: '978-1617292231', publisher: 'Manning', category: 'Computer Science', quantity: 6, availableCopies: 5, shelfNumber: 'CS-145' },
      { title: 'The Algorithm Design Manual', author: 'Steven S. Skiena', isbn: '978-3030542559', publisher: 'Springer', category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-146' },
      { title: 'Data Structures and Algorithms Made Easy', author: 'Narasimha Karumanchi', isbn: '978-8192107590', publisher: 'CareerMonk Publications', category: 'Computer Science', quantity: 5, availableCopies: 4, shelfNumber: 'CS-147' },
      { title: 'Problem Solving with Algorithms and Data Structures', author: 'Brad Miller, David Ranum', isbn: '978-1590282571', publisher: "Franklin, Beedle & Associates", category: 'Computer Science', quantity: 4, availableCopies: 3, shelfNumber: 'CS-148' },
      { title: 'Competitive Programming 3', author: 'Steven Halim, Felix Halim', isbn: '978-9810919108', publisher: 'Lulu', category: 'Computer Science', quantity: 3, availableCopies: 2, shelfNumber: 'CS-149' },
      { title: 'Mathematics for Computer Science', author: 'Eric Lehman, F. Thomson Leighton', isbn: '978-9888407064', publisher: 'Samurai Media', category: 'Computer Science', quantity: 4, availableCopies: 4, shelfNumber: 'CS-150' },

      // ─────────────────────────────────────────────
      // SOFTWARE ENGINEERING (50 books)
      // ─────────────────────────────────────────────
      { title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', isbn: '978-0201633610', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 6, availableCopies: 5, shelfNumber: 'SE-101' },
      { title: 'The Pragmatic Programmer: Your Journey to Mastery', author: 'David Thomas, Andrew Hunt', isbn: '978-0135957059', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-102' },
      { title: 'Software Engineering (10th Edition)', author: 'Ian Sommerville', isbn: '978-0133943030', publisher: 'Pearson', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-103' },
      { title: 'Code Complete (2nd Edition)', author: 'Steve McConnell', isbn: '978-0735619678', publisher: 'Microsoft Press', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-104' },
      { title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler', isbn: '978-0134757599', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-105' },
      { title: 'Head First Design Patterns', author: 'Eric Freeman, Elisabeth Robson', isbn: '978-0596007126', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-106' },
      { title: 'Domain-Driven Design', author: 'Eric Evans', isbn: '978-0321125217', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-107' },
      { title: 'Clean Architecture', author: 'Robert C. Martin', isbn: '978-0134494166', publisher: 'Prentice Hall', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-108' },
      { title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', isbn: '978-0201835953', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-109' },
      { title: 'Agile Software Development: Principles, Patterns, and Practices', author: 'Robert C. Martin', isbn: '978-0135974445', publisher: 'Prentice Hall', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-110' },
      { title: 'Continuous Delivery', author: 'Jez Humble, David Farley', isbn: '978-0321601919', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-111' },
      { title: 'Working Effectively with Legacy Code', author: 'Michael Feathers', isbn: '978-0131177055', publisher: 'Prentice Hall', category: 'Software Engineering', quantity: 3, availableCopies: 2, shelfNumber: 'SE-112' },
      { title: 'Test-Driven Development: By Example', author: 'Kent Beck', isbn: '978-0321146533', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-113' },
      { title: 'The Art of Readable Code', author: 'Dustin Boswell, Trevor Foucher', isbn: '978-0596802295', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 4, shelfNumber: 'SE-114' },
      { title: 'Software Architecture Patterns', author: 'Mark Richards', isbn: '978-1491924242', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-115' },
      { title: 'Building Microservices (2nd Edition)', author: 'Sam Newman', isbn: '978-1492034025', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-116' },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373320', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 5, availableCopies: 3, shelfNumber: 'SE-117' },
      { title: 'Patterns of Enterprise Application Architecture', author: 'Martin Fowler', isbn: '978-0321127426', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-118' },
      { title: 'Growing Object-Oriented Software, Guided by Tests', author: 'Steve Freeman, Nat Pryce', isbn: '978-0321503626', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 3, availableCopies: 2, shelfNumber: 'SE-119' },
      { title: 'Release It! Design and Deploy Production-Ready Software', author: 'Michael T. Nygard', isbn: '978-1680502398', publisher: 'Pragmatic Bookshelf', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-120' },
      { title: 'Software Testing: A Craftsman\'s Approach', author: 'Paul C. Jorgensen', isbn: '978-1466560680', publisher: 'CRC Press', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-121' },
      { title: 'The DevOps Handbook', author: 'Gene Kim, Jez Humble', isbn: '978-1950508402', publisher: 'IT Revolution Press', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-122' },
      { title: 'Accelerate: Building and Scaling High-Performing Technology Organizations', author: 'Nicole Forsgren, Jez Humble', isbn: '978-1942788331', publisher: 'IT Revolution Press', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-123' },
      { title: 'The Phoenix Project', author: 'Gene Kim, Kevin Behr', isbn: '978-1942788294', publisher: 'IT Revolution Press', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-124' },
      { title: 'Scrum: The Art of Doing Twice the Work in Half the Time', author: 'Jeff Sutherland', isbn: '978-0385346450', publisher: 'Crown Business', category: 'Software Engineering', quantity: 5, availableCopies: 5, shelfNumber: 'SE-125' },
      { title: 'Software Project Management', author: 'Bob Hughes, Mike Cotterell', isbn: '978-0077122799', publisher: 'McGraw-Hill', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-126' },
      { title: 'Requirement Engineering: Processes and Techniques', author: 'Gerald Kotonya, Ian Sommerville', isbn: '978-0471972082', publisher: 'Wiley', category: 'Software Engineering', quantity: 3, availableCopies: 3, shelfNumber: 'SE-127' },
      { title: 'User Stories Applied', author: 'Mike Cohn', isbn: '978-0321205681', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-128' },
      { title: 'Extreme Programming Explained', author: 'Kent Beck', isbn: '978-0321278654', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-129' },
      { title: 'Object-Oriented Analysis and Design with Applications', author: 'Grady Booch', isbn: '978-0201895513', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 3, availableCopies: 2, shelfNumber: 'SE-130' },
      { title: 'UML Distilled (3rd Edition)', author: 'Martin Fowler', isbn: '978-0321193681', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-131' },
      { title: 'The Clean Coder', author: 'Robert C. Martin', isbn: '978-0137081073', publisher: 'Prentice Hall', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-132' },
      { title: 'A Philosophy of Software Design', author: 'John Ousterhout', isbn: '978-1732102200', publisher: 'Yaknyam Press', category: 'Software Engineering', quantity: 4, availableCopies: 4, shelfNumber: 'SE-133' },
      { title: 'Software Craftsmanship', author: 'Pete McBreen', isbn: '978-0201733860', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 3, availableCopies: 2, shelfNumber: 'SE-134' },
      { title: 'Managing Software Debt', author: 'Chris Sterling', isbn: '978-0321948304', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 3, availableCopies: 3, shelfNumber: 'SE-135' },
      { title: 'The Software Architect Elevator', author: 'Gregor Hohpe', isbn: '978-1492077497', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-136' },
      { title: 'Fundamentals of Software Architecture', author: 'Mark Richards, Neal Ford', isbn: '978-1492043454', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-137' },
      { title: 'Software Architecture: The Hard Parts', author: 'Neal Ford, Mark Richards', isbn: '978-1492086895', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-138' },
      { title: 'The Art of Agile Development', author: 'James Shore', isbn: '978-1492080695', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-139' },
      { title: 'Software Engineering at Google', author: 'Titus Winters, Tom Manshreck', isbn: '978-1492082798', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-140' },
      { title: 'Implementing Domain-Driven Design', author: 'Vaughn Vernon', isbn: '978-0321834577', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-141' },
      { title: 'Microservices Patterns', author: 'Chris Richardson', isbn: '978-1617294549', publisher: 'Manning', category: 'Software Engineering', quantity: 5, availableCopies: 4, shelfNumber: 'SE-142' },
      { title: 'Enterprise Integration Patterns', author: 'Gregor Hohpe, Bobby Woolf', isbn: '978-0321200686', publisher: 'Addison-Wesley', category: 'Software Engineering', quantity: 3, availableCopies: 2, shelfNumber: 'SE-143' },
      { title: 'Site Reliability Engineering', author: 'Niall Richard Murphy, Betsy Beyer', isbn: '978-1491929124', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-144' },
      { title: 'Docker Deep Dive', author: 'Nigel Poulton', isbn: '978-1521822807', publisher: 'Independently published', category: 'Software Engineering', quantity: 4, availableCopies: 4, shelfNumber: 'SE-145' },
      { title: 'Kubernetes in Action', author: 'Marko Luksa', isbn: '978-1617293726', publisher: 'Manning', category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-146' },
      { title: 'Cloud Native Patterns', author: 'Cornelia Davis', isbn: '978-1617294297', publisher: 'Manning', category: 'Software Engineering', quantity: 3, availableCopies: 3, shelfNumber: 'SE-147' },
      { title: 'The DevOps Adoption Playbook', author: 'Sanjeev Sharma', isbn: '978-1119308744', publisher: 'Wiley', category: 'Software Engineering', quantity: 3, availableCopies: 2, shelfNumber: 'SE-148' },
      { title: 'Infrastructure as Code', author: 'Kief Morris', isbn: '978-1098114671', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 4, availableCopies: 3, shelfNumber: 'SE-149' },
      { title: 'Learning Git', author: 'Anna Skoulikari', isbn: '978-1098133917', publisher: "O'Reilly Media", category: 'Software Engineering', quantity: 5, availableCopies: 5, shelfNumber: 'SE-150' },

      // ─────────────────────────────────────────────
      // ARTIFICIAL INTELLIGENCE (50 books)
      // ─────────────────────────────────────────────
      { title: 'Artificial Intelligence: A Modern Approach (4th Edition)', author: 'Stuart Russell, Peter Norvig', isbn: '978-0134610993', publisher: 'Pearson', category: 'Artificial Intelligence', quantity: 3, availableCopies: 1, shelfNumber: 'AI-101' },
      { title: 'Deep Learning', author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', isbn: '978-0262035613', publisher: 'MIT Press', category: 'Artificial Intelligence', quantity: 5, availableCopies: 3, shelfNumber: 'AI-102' },
      { title: 'Pattern Recognition and Machine Learning', author: 'Christopher M. Bishop', isbn: '978-0387310732', publisher: 'Springer', category: 'Artificial Intelligence', quantity: 4, availableCopies: 2, shelfNumber: 'AI-103' },
      { title: 'Machine Learning: A Probabilistic Perspective', author: 'Kevin P. Murphy', isbn: '978-0262018029', publisher: 'MIT Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-104' },
      { title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', author: 'Aurélien Géron', isbn: '978-1098125974', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 6, availableCopies: 4, shelfNumber: 'AI-105' },
      { title: 'The Hundred-Page Machine Learning Book', author: 'Andriy Burkov', isbn: '978-1999579500', publisher: 'Andriy Burkov', category: 'Artificial Intelligence', quantity: 5, availableCopies: 4, shelfNumber: 'AI-106' },
      { title: 'Python Machine Learning', author: 'Sebastian Raschka, Vahid Mirjalili', isbn: '978-1789955750', publisher: 'Packt Publishing', category: 'Artificial Intelligence', quantity: 5, availableCopies: 3, shelfNumber: 'AI-107' },
      { title: 'Natural Language Processing with Python', author: 'Steven Bird, Ewan Klein, Edward Loper', isbn: '978-0596516499', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-108' },
      { title: 'Speech and Language Processing (3rd Edition)', author: 'Daniel Jurafsky, James H. Martin', isbn: '978-0131873216', publisher: 'Pearson', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-109' },
      { title: 'Computer Vision: Algorithms and Applications', author: 'Richard Szeliski', isbn: '978-3030343712', publisher: 'Springer', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-110' },
      { title: 'Reinforcement Learning: An Introduction', author: 'Richard S. Sutton, Andrew G. Barto', isbn: '978-0262039246', publisher: 'MIT Press', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-111' },
      { title: 'Probabilistic Graphical Models', author: 'Daphne Koller, Nir Friedman', isbn: '978-0262013192', publisher: 'MIT Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-112' },
      { title: 'Neural Networks and Deep Learning', author: 'Michael Nielsen', isbn: '978-2919931989', publisher: 'Determination Press', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-113' },
      { title: 'Deep Learning with Python', author: 'François Chollet', isbn: '978-1617296864', publisher: 'Manning', category: 'Artificial Intelligence', quantity: 5, availableCopies: 4, shelfNumber: 'AI-114' },
      { title: 'Data Science from Scratch', author: 'Joel Grus', isbn: '978-1492041139', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-115' },
      { title: 'Applied Machine Learning', author: 'David Forsyth', isbn: '978-3030181130', publisher: 'Springer', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-116' },
      { title: 'Machine Learning Yearning', author: 'Andrew Ng', isbn: '978-0999235195', publisher: 'Independently Published', category: 'Artificial Intelligence', quantity: 4, availableCopies: 4, shelfNumber: 'AI-117' },
      { title: 'Artificial Intelligence: Foundations of Computational Agents', author: 'David Poole, Alan Mackworth', isbn: '978-1107195394', publisher: 'Cambridge University Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-118' },
      { title: 'An Introduction to Machine Learning Interpretability', author: 'Patrick Hall, Navdeep Gill', isbn: '978-1098101657', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-119' },
      { title: 'Explainable AI: Interpreting, Explaining and Visualizing DL', author: 'Wojciech Samek, Grégoire Montavon', isbn: '978-3030289539', publisher: 'Springer', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-120' },
      { title: 'Generative Deep Learning', author: 'David Foster', isbn: '978-1098134174', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-121' },
      { title: 'Natural Language Processing with Transformers', author: 'Lewis Tunstall, Leandro von Werra', isbn: '978-1098103248', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-122' },
      { title: 'Transformers for Natural Language Processing', author: 'Denis Rothman', isbn: '978-1803247335', publisher: 'Packt Publishing', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-123' },
      { title: 'Machine Learning with PyTorch and Scikit-Learn', author: 'Sebastian Raschka', isbn: '978-1801819312', publisher: 'Packt Publishing', category: 'Artificial Intelligence', quantity: 5, availableCopies: 4, shelfNumber: 'AI-124' },
      { title: 'Programming PyTorch for Deep Learning', author: 'Ian Pointer', isbn: '978-1492045359', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-125' },
      { title: 'TensorFlow for Deep Learning', author: 'Bharath Ramsundar, Reza Bosagh Zadeh', isbn: '978-1491980446', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-126' },
      { title: 'Statistical Learning Theory', author: 'Vladimir Vapnik', isbn: '978-0471030034', publisher: 'Wiley-Interscience', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-127' },
      { title: 'The Elements of Statistical Learning', author: 'Trevor Hastie, Robert Tibshirani', isbn: '978-0387848570', publisher: 'Springer', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-128' },
      { title: 'An Introduction to Statistical Learning', author: 'Gareth James, Daniela Witten', isbn: '978-1071614174', publisher: 'Springer', category: 'Artificial Intelligence', quantity: 5, availableCopies: 4, shelfNumber: 'AI-129' },
      { title: 'Bayesian Reasoning and Machine Learning', author: 'David Barber', isbn: '978-0521518147', publisher: 'Cambridge University Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-130' },
      { title: 'AI Superpowers: China, Silicon Valley, and the New World Order', author: 'Kai-Fu Lee', isbn: '978-1328546395', publisher: 'Houghton Mifflin Harcourt', category: 'Artificial Intelligence', quantity: 4, availableCopies: 4, shelfNumber: 'AI-131' },
      { title: 'Superintelligence: Paths, Dangers, Strategies', author: 'Nick Bostrom', isbn: '978-0198739838', publisher: 'Oxford University Press', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-132' },
      { title: 'Human Compatible: AI and the Problem of Control', author: 'Stuart Russell', isbn: '978-0525558613', publisher: 'Viking', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-133' },
      { title: 'The Alignment Problem', author: 'Brian Christian', isbn: '978-0393635829', publisher: 'W. W. Norton & Company', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-134' },
      { title: 'Life 3.0: Being Human in the Age of Artificial Intelligence', author: 'Max Tegmark', isbn: '978-1101970317', publisher: 'Knopf', category: 'Artificial Intelligence', quantity: 4, availableCopies: 4, shelfNumber: 'AI-135' },
      { title: 'Atlas of AI', author: 'Kate Crawford', isbn: '978-0300209570', publisher: 'Yale University Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 3, shelfNumber: 'AI-136' },
      { title: 'Data-Driven Science and Engineering', author: 'Steven L. Brunton, J. Nathan Kutz', isbn: '978-1108422093', publisher: 'Cambridge University Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-137' },
      { title: 'Feature Engineering for Machine Learning', author: 'Alice Zheng, Amanda Casari', isbn: '978-1491953242', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-138' },
      { title: 'Approaching (Almost) Any Machine Learning Problem', author: 'Abhishek Thakur', isbn: '978-8269211504', publisher: 'Independently Published', category: 'Artificial Intelligence', quantity: 4, availableCopies: 4, shelfNumber: 'AI-139' },
      { title: 'Machine Learning Design Patterns', author: 'Valliappa Lakshmanan, Sara Robinson', isbn: '978-1098115784', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-140' },
      { title: 'Practical Statistics for Data Scientists', author: 'Peter Bruce, Andrew Bruce', isbn: '978-1492072942', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 5, availableCopies: 4, shelfNumber: 'AI-141' },
      { title: 'Deep Learning for Coders with fastai and PyTorch', author: 'Jeremy Howard, Sylvain Gugger', isbn: '978-1492045526', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-142' },
      { title: 'AI Ethics', author: 'Mark Coeckelbergh', isbn: '978-0262538190', publisher: 'MIT Press', category: 'Artificial Intelligence', quantity: 4, availableCopies: 4, shelfNumber: 'AI-143' },
      { title: 'Weapons of Math Destruction', author: 'Cathy O\'Neil', isbn: '978-0553418811', publisher: 'Crown', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-144' },
      { title: 'Prediction Machines: The Simple Economics of AI', author: 'Ajay Agrawal, Joshua Gans, Avi Goldfarb', isbn: '978-1633695672', publisher: 'Harvard Business Review Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 3, shelfNumber: 'AI-145' },
      { title: 'Robot Proof: Higher Education in the Age of Artificial Intelligence', author: 'Joseph E. Aoun', isbn: '978-0262037280', publisher: 'MIT Press', category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-146' },
      { title: 'The Master Algorithm', author: 'Pedro Domingos', isbn: '978-0465094271', publisher: 'Basic Books', category: 'Artificial Intelligence', quantity: 4, availableCopies: 4, shelfNumber: 'AI-147' },
      { title: 'Grokking Deep Learning', author: 'Andrew W. Trask', isbn: '978-1617293702', publisher: 'Manning', category: 'Artificial Intelligence', quantity: 5, availableCopies: 4, shelfNumber: 'AI-148' },
      { title: 'Practical Deep Learning for Cloud and Mobile', author: 'Anirudh Koul, Siddha Ganju', isbn: '978-1492034865', publisher: "O'Reilly Media", category: 'Artificial Intelligence', quantity: 3, availableCopies: 2, shelfNumber: 'AI-149' },
      { title: 'Grokking Artificial Intelligence Algorithms', author: 'Rishal Hurbans', isbn: '978-1617296185', publisher: 'Manning', category: 'Artificial Intelligence', quantity: 4, availableCopies: 3, shelfNumber: 'AI-150' },

      // ─────────────────────────────────────────────
      // DATABASE SYSTEMS (50 books)
      // ─────────────────────────────────────────────
      { title: 'Database System Concepts (7th Edition)', author: 'Abraham Silberschatz, Henry F. Korth', isbn: '978-0078022159', publisher: 'McGraw-Hill', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-101' },
      { title: 'Fundamentals of Database Systems (7th Edition)', author: 'Ramez Elmasri, Shamkant B. Navathe', isbn: '978-0133970777', publisher: 'Pearson', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-102' },
      { title: 'Database Management Systems (3rd Edition)', author: 'Raghu Ramakrishnan, Johannes Gehrke', isbn: '978-0072465631', publisher: 'McGraw-Hill', category: 'Database Systems', quantity: 4, availableCopies: 2, shelfNumber: 'DB-103' },
      { title: 'An Introduction to Database Systems', author: 'C.J. Date', isbn: '978-0321197849', publisher: 'Addison-Wesley', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-104' },
      { title: 'NoSQL Distilled', author: 'Pramod J. Sadalage, Martin Fowler', isbn: '978-0321826626', publisher: 'Addison-Wesley', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-105' },
      { title: 'Designing Data-Intensive Applications (DB Copy)', author: 'Martin Kleppmann', isbn: '978-1449373320-DB', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 5, availableCopies: 4, shelfNumber: 'DB-106' },
      { title: 'SQL Performance Explained', author: 'Markus Winand', isbn: '978-3950307825', publisher: 'Markus Winand', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-107' },
      { title: 'Learning SQL (3rd Edition)', author: 'Alan Beaulieu', isbn: '978-1492057611', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 5, availableCopies: 4, shelfNumber: 'DB-108' },
      { title: 'SQL Cookbook (2nd Edition)', author: 'Anthony Molinaro, Robert de Graaf', isbn: '978-1492077442', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-109' },
      { title: 'PostgreSQL: Up and Running', author: 'Regina Obe, Leo Hsu', isbn: '978-1492080274', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-110' },
      { title: 'MySQL Crash Course', author: 'Ben Forta', isbn: '978-0672327650', publisher: 'Sams Publishing', category: 'Database Systems', quantity: 5, availableCopies: 4, shelfNumber: 'DB-111' },
      { title: 'MongoDB: The Definitive Guide (3rd Edition)', author: 'Shannon Bradshaw, Eoin Brazil', isbn: '978-1491954461', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-112' },
      { title: 'Redis in Action', author: 'Josiah L. Carlson', isbn: '978-1617290855', publisher: 'Manning', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-113' },
      { title: 'Cassandra: The Definitive Guide', author: 'Jeff Carpenter, Eben Hewitt', isbn: '978-1492097143', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-114' },
      { title: 'Graph Databases (2nd Edition)', author: 'Ian Robinson, Jim Webber', isbn: '978-1491930892', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 3, availableCopies: 3, shelfNumber: 'DB-115' },
      { title: 'The Data Warehouse Toolkit (3rd Edition)', author: 'Ralph Kimball, Margy Ross', isbn: '978-1118530801', publisher: 'Wiley', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-116' },
      { title: 'Building the Data Warehouse', author: 'W.H. Inmon', isbn: '978-0764599446', publisher: 'Wiley', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-117' },
      { title: 'Data Modeling: A Beginner\'s Guide', author: 'Andy Oppel', isbn: '978-0071610582', publisher: 'McGraw-Hill', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-118' },
      { title: 'Agile Data Warehouse Design', author: 'Lawrence Corr, Jim Stagnitto', isbn: '978-0956817594', publisher: 'DecisionOne Consulting', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-119' },
      { title: 'Seven Databases in Seven Weeks', author: 'Eric Redmond, Jim R. Wilson', isbn: '978-1680502534', publisher: 'Pragmatic Bookshelf', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-120' },
      { title: 'Elasticsearch: The Definitive Guide', author: 'Clinton Gormley, Zachary Tong', isbn: '978-1449358549', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-121' },
      { title: 'High Performance MySQL (4th Edition)', author: 'Silvia Botros, Jeremy Tinley', isbn: '978-1492080510', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-122' },
      { title: 'Oracle Database 19c: The Complete Reference', author: 'Bob Bryla, Kevin Loney', isbn: '978-1260462456', publisher: 'McGraw-Hill', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-123' },
      { title: 'SQL Server 2019 Administration Inside Out', author: 'Randolph West', isbn: '978-0135561089', publisher: 'Microsoft Press', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-124' },
      { title: 'T-SQL Fundamentals (4th Edition)', author: 'Itzik Ben-Gan', isbn: '978-0138102104', publisher: 'Microsoft Press', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-125' },
      { title: 'Pro SQL Server Internals (2nd Edition)', author: 'Dmitri Korotkevitch', isbn: '978-1484219638', publisher: 'Apress', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-126' },
      { title: 'SQL Antipatterns: Avoiding the Pitfalls of Database Programming', author: 'Bill Karwin', isbn: '978-1934356555', publisher: 'Pragmatic Bookshelf', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-127' },
      { title: 'Relational Database Design and Implementation', author: 'Jan L. Harrington', isbn: '978-0123747303', publisher: 'Morgan Kaufmann', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-128' },
      { title: 'Database Internals', author: 'Alex Petrov', isbn: '978-1492040347', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-129' },
      { title: 'Introduction to Information Retrieval', author: 'Christopher Manning, Prabhakar Raghavan', isbn: '978-0521865715', publisher: 'Cambridge University Press', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-130' },
      { title: 'Readings in Database Systems (5th Edition)', author: 'Joseph M. Hellerstein, Michael Stonebraker', isbn: '978-0262693141', publisher: 'MIT Press', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-131' },
      { title: 'The Art of SQL', author: 'Stéphane Faroult', isbn: '978-0596008949', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-132' },
      { title: 'Joe Celko\'s SQL Puzzles and Answers', author: 'Joe Celko', isbn: '978-0123735966', publisher: 'Morgan Kaufmann', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-133' },
      { title: 'Data Quality: The Accuracy Dimension', author: 'Jack E. Olson', isbn: '978-1558608917', publisher: 'Morgan Kaufmann', category: 'Database Systems', quantity: 3, availableCopies: 3, shelfNumber: 'DB-134' },
      { title: 'Streaming Systems', author: 'Tyler Akidau, Slava Chernyak', isbn: '978-1491983874', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-135' },
      { title: 'Big Data: Principles and Best Practices', author: 'Nathan Marz, James Warren', isbn: '978-1617290343', publisher: 'Manning', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-136' },
      { title: 'Hadoop: The Definitive Guide (4th Edition)', author: 'Tom White', isbn: '978-1491901632', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-137' },
      { title: 'Spark: The Definitive Guide', author: 'Bill Chambers, Matei Zaharia', isbn: '978-1491912218', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-138' },
      { title: 'Learning Spark (2nd Edition)', author: 'Jules Damji, Brooke Wenig', isbn: '978-1492050049', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-139' },
      { title: 'Kafka: The Definitive Guide (2nd Edition)', author: 'Gwen Shapira, Todd Palino', isbn: '978-1492043089', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-140' },
      { title: 'Data Mesh', author: 'Zhamak Dehghani', isbn: '978-1492092391', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 3, availableCopies: 3, shelfNumber: 'DB-141' },
      { title: 'Snowflake Definitive Guide', author: 'Joyce Kay Avila', isbn: '978-1098103743', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-142' },
      { title: 'The Data Engineering Cookbook', author: 'Andreas Kretz', isbn: '978-0000000000', publisher: 'Independently Published', category: 'Database Systems', quantity: 4, availableCopies: 4, shelfNumber: 'DB-143' },
      { title: 'Database Design for Mere Mortals', author: 'Michael J. Hernandez', isbn: '978-0136788041', publisher: 'Addison-Wesley', category: 'Database Systems', quantity: 5, availableCopies: 4, shelfNumber: 'DB-144' },
      { title: 'Transactional Information Systems', author: 'Gerhard Weikum, Gottfried Vossen', isbn: '978-1558605084', publisher: 'Morgan Kaufmann', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-145' },
      { title: 'NewSQL Databases', author: 'Samuel Fricker', isbn: '978-3031234453', publisher: 'Springer', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-146' },
      { title: 'Time Series Databases', author: 'Ted Dunning, Ellen Friedman', isbn: '978-1491914724', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-147' },
      { title: 'DynamoDB Applied Design Patterns', author: 'Uchit Vyas, Prabhakaran Kuppusamy', isbn: '978-1783551897', publisher: 'Packt Publishing', category: 'Database Systems', quantity: 3, availableCopies: 2, shelfNumber: 'DB-148' },
      { title: 'Cloud Databases: A Practical Introduction', author: 'John C. Ryan', isbn: '978-1098107321', publisher: "O'Reilly Media", category: 'Database Systems', quantity: 3, availableCopies: 3, shelfNumber: 'DB-149' },
      { title: 'Data Engineering with Python', author: 'Paul Crickard', isbn: '978-1839214189', publisher: 'Packt Publishing', category: 'Database Systems', quantity: 4, availableCopies: 3, shelfNumber: 'DB-150' },

      // ─────────────────────────────────────────────
      // NETWORKING (50 books)
      // ─────────────────────────────────────────────
      { title: 'Computer Networking: A Top-Down Approach (8th Edition)', author: 'James Kurose, Keith Ross', isbn: '978-0133594140', publisher: 'Pearson', category: 'Networking', quantity: 4, availableCopies: 4, shelfNumber: 'NET-101' },
      { title: 'Computer Networks (5th Edition)', author: 'Andrew S. Tanenbaum, David J. Wetherall', isbn: '978-0132126953', publisher: 'Pearson', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-102' },
      { title: 'Data Communications and Networking', author: 'Behrouz A. Forouzan', isbn: '978-0073376226', publisher: 'McGraw-Hill', category: 'Networking', quantity: 5, availableCopies: 4, shelfNumber: 'NET-103' },
      { title: 'TCP/IP Illustrated, Vol. 1: The Protocols', author: 'W. Richard Stevens', isbn: '978-0321336316', publisher: 'Addison-Wesley', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-104' },
      { title: 'Network Programming with Go', author: 'Adam Woodbeck', isbn: '978-1718500884', publisher: 'No Starch Press', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-105' },
      { title: 'CCNA 200-301 Official Cert Guide, Volume 1', author: 'Wendell Odom', isbn: '978-0135792735', publisher: 'Cisco Press', category: 'Networking', quantity: 5, availableCopies: 4, shelfNumber: 'NET-106' },
      { title: 'CCNA 200-301 Official Cert Guide, Volume 2', author: 'Wendell Odom', isbn: '978-0135792780', publisher: 'Cisco Press', category: 'Networking', quantity: 5, availableCopies: 4, shelfNumber: 'NET-107' },
      { title: 'Network Warrior (2nd Edition)', author: 'Gary A. Donahue', isbn: '978-1449387860', publisher: "O'Reilly Media", category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-108' },
      { title: 'Routing TCP/IP, Volume I (2nd Edition)', author: 'Jeff Doyle', isbn: '978-1587052026', publisher: 'Cisco Press', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-109' },
      { title: 'IP Routing on Cisco IOS, IOS XE, and IOS XR', author: 'Brad Edgeworth', isbn: '978-1587144233', publisher: 'Cisco Press', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-110' },
      { title: 'Wireless Communications: Principles and Practice', author: 'Theodore S. Rappaport', isbn: '978-0130422323', publisher: 'Prentice Hall', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-111' },
      { title: 'Network Security Essentials (6th Edition)', author: 'William Stallings', isbn: '978-0134527338', publisher: 'Pearson', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-112' },
      { title: 'Cryptography and Network Security', author: 'William Stallings', isbn: '978-0134444284', publisher: 'Pearson', category: 'Networking', quantity: 5, availableCopies: 4, shelfNumber: 'NET-113' },
      { title: 'Network Security: Private Communication in a Public World', author: 'Charlie Kaufman, Radia Perlman', isbn: '978-0137035427', publisher: 'Pearson', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-114' },
      { title: 'The Practice of Network Security Monitoring', author: 'Richard Bejtlich', isbn: '978-1593275099', publisher: 'No Starch Press', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-115' },
      { title: 'Hacking: The Art of Exploitation', author: 'Jon Erickson', isbn: '978-1593271442', publisher: 'No Starch Press', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-116' },
      { title: 'The Web Application Hacker\'s Handbook', author: 'Dafydd Stuttard, Marcus Pinto', isbn: '978-1118026472', publisher: 'Wiley', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-117' },
      { title: 'HTTP: The Definitive Guide', author: 'David Gourley, Brian Totty', isbn: '978-1565925090', publisher: "O'Reilly Media", category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-118' },
      { title: 'High Performance Browser Networking', author: 'Ilya Grigorik', isbn: '978-1449344764', publisher: "O'Reilly Media", category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-119' },
      { title: 'SDN: Software Defined Networks', author: 'Thomas D. Nadeau, Ken Gray', isbn: '978-1449342302', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-120' },
      { title: 'Cloud Networking: Understanding Cloud-Based Data Center Networks', author: 'Gary Lee', isbn: '978-0128007297', publisher: 'Morgan Kaufmann', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-121' },
      { title: 'Ethernet: The Definitive Guide (2nd Edition)', author: 'Charles Spurgeon, Joann Zimmerman', isbn: '978-1449361846', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 3, shelfNumber: 'NET-122' },
      { title: 'DNS and BIND (5th Edition)', author: 'Cricket Liu, Paul Albitz', isbn: '978-0596100575', publisher: "O'Reilly Media", category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-123' },
      { title: 'Practical Packet Analysis (3rd Edition)', author: 'Chris Sanders', isbn: '978-1593278021', publisher: 'No Starch Press', category: 'Networking', quantity: 4, availableCopies: 4, shelfNumber: 'NET-124' },
      { title: 'Wireshark Network Analysis', author: 'Laura Chappell', isbn: '978-1893939943', publisher: 'Protocol Analysis Institute', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-125' },
      { title: 'Network Analysis Using Wireshark 2 Cookbook', author: 'Nagendra Kumar Nainar', isbn: '978-1786461872', publisher: 'Packt Publishing', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-126' },
      { title: 'Juniper Networks Routers: The Complete Reference', author: 'Peter Southwick', isbn: '978-0072224528', publisher: 'McGraw-Hill', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-127' },
      { title: 'MPLS in the SDN Era', author: 'Antonio Monge, Krzysztof Szarkowicz', isbn: '978-1491932711', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-128' },
      { title: '5G NR: The Next Generation Wireless Access Technology', author: 'Erik Dahlman, Stefan Parkvall', isbn: '978-0128143230', publisher: 'Academic Press', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-129' },
      { title: 'IoT Fundamentals: Networking Technologies, Protocols, and Use Cases', author: 'David Hanes, Gonzalo Salgueiro', isbn: '978-1587144561', publisher: 'Cisco Press', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-130' },
      { title: 'Network Automation Cookbook', author: 'Karim Okasha', isbn: '978-1789956481', publisher: 'Packt Publishing', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-131' },
      { title: 'Python Network Programming Cookbook', author: 'Dr. M. O. Faruque Sarker', isbn: '978-1786463999', publisher: 'Packt Publishing', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-132' },
      { title: 'Automate Your Network', author: 'John W. Capobianco', isbn: '978-1796625394', publisher: 'Independently Published', category: 'Networking', quantity: 3, availableCopies: 3, shelfNumber: 'NET-133' },
      { title: 'CompTIA Network+ Study Guide', author: 'Todd Lammle', isbn: '978-1119811190', publisher: 'Sybex', category: 'Networking', quantity: 5, availableCopies: 4, shelfNumber: 'NET-134' },
      { title: 'OSPF: Anatomy of an Internet Routing Protocol', author: 'John T. Moy', isbn: '978-0201634723', publisher: 'Addison-Wesley', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-135' },
      { title: 'BGP Design and Implementation', author: 'Randy Zhang, Micah Bartell', isbn: '978-1587051526', publisher: 'Cisco Press', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-136' },
      { title: 'Network Performance and Security', author: 'Chris Chapman', isbn: '978-0128036051', publisher: 'Syngress', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-137' },
      { title: 'Zero Trust Networks', author: 'Evan Gilman, Doug Barth', isbn: '978-1492096597', publisher: "O'Reilly Media", category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-138' },
      { title: 'Network Programmability and Automation', author: 'Jason Edelman, Scott S. Lowe', isbn: '978-1491931257', publisher: "O'Reilly Media", category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-139' },
      { title: 'Cloud Native Infrastructure', author: 'Justin Garrison, Kris Nova', isbn: '978-1491984307', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 3, shelfNumber: 'NET-140' },
      { title: 'Load Balancing in the Cloud', author: 'Derek DeJonghe', isbn: '978-1492038009', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-141' },
      { title: 'gRPC: Up and Running', author: 'Kasun Indrasiri, Danesh Kuruppu', isbn: '978-1492058335', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 3, shelfNumber: 'NET-142' },
      { title: 'WebRTC: APIs and RTCWEB Protocols', author: 'Alan B. Johnston, Daniel C. Burnett', isbn: '978-0985978540', publisher: 'Digital Codex', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-143' },
      { title: 'QUIC and HTTP/3: Internet Transport Evolution', author: 'Robin Marx', isbn: '978-9464787013', publisher: 'Independently Published', category: 'Networking', quantity: 3, availableCopies: 3, shelfNumber: 'NET-144' },
      { title: 'OpenStack Networking Essentials', author: 'James Denton', isbn: '978-1785283277', publisher: 'Packt Publishing', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-145' },
      { title: 'VPN: Virtual Private Networks', author: 'Charlie Scott, Paul Wolfe, Mike Erwin', isbn: '978-0596000103', publisher: "O'Reilly Media", category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-146' },
      { title: 'LAN Switching and Wireless', author: 'Wayne Lewis', isbn: '978-1587132094', publisher: 'Cisco Press', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-147' },
      { title: 'Introduction to Wireless and Mobile Systems', author: 'Dharma P. Agrawal, Qing-An Zeng', isbn: '978-1305087330', publisher: 'Cengage Learning', category: 'Networking', quantity: 4, availableCopies: 3, shelfNumber: 'NET-148' },
      { title: 'Telecommunications Essentials (2nd Edition)', author: 'Lillian Goleniewski', isbn: '978-0321427649', publisher: 'Addison-Wesley', category: 'Networking', quantity: 3, availableCopies: 2, shelfNumber: 'NET-149' },
      { title: 'Network Fundamentals: CCNA Exploration Companion Guide', author: 'Mark Dye, Rick McDonald, Antoon Rufi', isbn: '978-1587132087', publisher: 'Cisco Press', category: 'Networking', quantity: 5, availableCopies: 4, shelfNumber: 'NET-150' },

      // ─────────────────────────────────────────────
      // OPERATING SYSTEMS (50 books)
      // ─────────────────────────────────────────────
      { title: 'Operating System Concepts (10th Edition)', author: 'Abraham Silberschatz, Peter B. Galvin', isbn: '978-1119800361', publisher: 'Wiley', category: 'Operating Systems', quantity: 5, availableCopies: 3, shelfNumber: 'OS-101' },
      { title: 'Modern Operating Systems (4th Edition)', author: 'Andrew S. Tanenbaum, Herbert Bos', isbn: '978-0133591620', publisher: 'Pearson', category: 'Operating Systems', quantity: 5, availableCopies: 4, shelfNumber: 'OS-102' },
      { title: 'Operating Systems: Three Easy Pieces', author: 'Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau', isbn: '978-1985086593', publisher: 'Arpaci-Dusseau Books', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-103' },
      { title: 'The Linux Command Line (2nd Edition)', author: 'William E. Shotts Jr.', isbn: '978-1593279523', publisher: 'No Starch Press', category: 'Operating Systems', quantity: 6, availableCopies: 5, shelfNumber: 'OS-104' },
      { title: 'Advanced Programming in the UNIX Environment (3rd Edition)', author: 'W. Richard Stevens, Stephen A. Rago', isbn: '978-0321637734', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-105' },
      { title: 'UNIX Network Programming, Volume 1 (3rd Edition)', author: 'W. Richard Stevens', isbn: '978-0131411555', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-106' },
      { title: 'Linux Kernel Development (3rd Edition)', author: 'Robert Love', isbn: '978-0672329463', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-107' },
      { title: 'Understanding the Linux Kernel (3rd Edition)', author: 'Daniel P. Bovet, Marco Cesati', isbn: '978-0596005658', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-108' },
      { title: 'Linux Device Drivers (3rd Edition)', author: 'Jonathan Corbet, Alessandro Rubini', isbn: '978-0596005900', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-109' },
      { title: 'The Design and Implementation of the FreeBSD Operating System', author: 'Marshall Kirk McKusick, George V. Neville-Neil', isbn: '978-0201702453', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-110' },
      { title: 'Windows Internals, Part 1 (7th Edition)', author: 'Pavel Yosifovich, Alex Ionescu', isbn: '978-0735684188', publisher: 'Microsoft Press', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-111' },
      { title: 'Windows Internals, Part 2 (7th Edition)', author: 'Andrea Allievi, Alex Ionescu', isbn: '978-0135462409', publisher: 'Microsoft Press', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-112' },
      { title: 'macOS Internals: A Systems Approach', author: 'Jonathan Levin', isbn: '978-0991055548', publisher: 'Technologeeks Press', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-113' },
      { title: 'The Art of Exploitation: Buffer Overflows', author: 'Jon Erickson', isbn: '978-1593271442-OS', publisher: 'No Starch Press', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-114' },
      { title: 'Operating Systems: Internals and Design Principles', author: 'William Stallings', isbn: '978-0134670959', publisher: 'Pearson', category: 'Operating Systems', quantity: 5, availableCopies: 4, shelfNumber: 'OS-115' },
      { title: 'Operating Systems: Design and Implementation', author: 'Andrew S. Tanenbaum, Albert S. Woodhull', isbn: '978-0131429383', publisher: 'Pearson', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-116' },
      { title: 'Systems Programming in Unix/Linux', author: 'K.C. Wang', isbn: '978-3319924274', publisher: 'Springer', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-117' },
      { title: 'Computer Systems: A Programmer\'s Perspective', author: 'Randal E. Bryant, David R. O\'Hallaron', isbn: '978-0134092669', publisher: 'Pearson', category: 'Operating Systems', quantity: 5, availableCopies: 4, shelfNumber: 'OS-118' },
      { title: 'The Practice of System and Network Administration', author: 'Thomas A. Limoncelli', isbn: '978-0321919168', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-119' },
      { title: 'UNIX and Linux System Administration Handbook (5th Edition)', author: 'Evi Nemeth, Garth Snyder', isbn: '978-0134277554', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 5, availableCopies: 4, shelfNumber: 'OS-120' },
      { title: 'How Linux Works (3rd Edition)', author: 'Brian Ward', isbn: '978-1718500419', publisher: 'No Starch Press', category: 'Operating Systems', quantity: 5, availableCopies: 4, shelfNumber: 'OS-121' },
      { title: 'The Linux Programming Interface', author: 'Michael Kerrisk', isbn: '978-1593272203', publisher: 'No Starch Press', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-122' },
      { title: 'Linux System Programming (2nd Edition)', author: 'Robert Love', isbn: '978-1449339531', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-123' },
      { title: 'Beginning Linux Programming (4th Edition)', author: 'Neil Matthew, Richard Stones', isbn: '978-0470147627', publisher: 'Wrox', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-124' },
      { title: 'Linux Bible (10th Edition)', author: 'Christopher Negus', isbn: '978-1119578888', publisher: 'Wiley', category: 'Operating Systems', quantity: 5, availableCopies: 4, shelfNumber: 'OS-125' },
      { title: 'Bash Pocket Reference (2nd Edition)', author: 'Arnold Robbins', isbn: '978-1491941591', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 4, shelfNumber: 'OS-126' },
      { title: 'Learning the bash Shell (3rd Edition)', author: 'Cameron Newham', isbn: '978-0596009656', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-127' },
      { title: 'sed & awk (2nd Edition)', author: 'Dale Dougherty, Arnold Robbins', isbn: '978-1565922259', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-128' },
      { title: 'Classic Shell Scripting', author: 'Arnold Robbins, Nelson H.F. Beebe', isbn: '978-0596005955', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 3, availableCopies: 3, shelfNumber: 'OS-129' },
      { title: 'PowerShell in a Month of Lunches (4th Edition)', author: 'Travis Plunk, James Petty', isbn: '978-1617295850', publisher: 'Manning', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-130' },
      { title: 'Embedded Systems: Real-Time Operating Systems for ARM Cortex-M Microcontrollers', author: 'Jonathan Valvano', isbn: '978-1466468863', publisher: 'Independently Published', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-131' },
      { title: 'Real-Time Systems', author: 'Jane W. S. Liu', isbn: '978-0130996510', publisher: 'Prentice Hall', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-132' },
      { title: 'Distributed Systems: Principles and Paradigms', author: 'Andrew S. Tanenbaum, Maarten Van Steen', isbn: '978-1530281756', publisher: 'Independently Published', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-133' },
      { title: 'Designing Distributed Systems', author: 'Brendan Burns', isbn: '978-1491983645', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-134' },
      { title: 'Virtual Machines', author: 'James E. Smith, Ravi Nair', isbn: '978-1558609105', publisher: 'Morgan Kaufmann', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-135' },
      { title: 'Virtualization Essentials', author: 'Matthew Portnoy', isbn: '978-1118176825', publisher: 'Sybex', category: 'Operating Systems', quantity: 3, availableCopies: 3, shelfNumber: 'OS-136' },
      { title: 'The Definitive Guide to Linux Network Programming', author: 'Nathan Yocom, Keir Davis, John Turner', isbn: '978-1590593226', publisher: 'Apress', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-137' },
      { title: 'Mastering Linux Performance Monitoring', author: 'Rene Mosel', isbn: '978-1789134292', publisher: 'Packt Publishing', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-138' },
      { title: 'BPF Performance Tools', author: 'Brendan Gregg', isbn: '978-0136554820', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-139' },
      { title: 'Systems Performance (2nd Edition)', author: 'Brendan Gregg', isbn: '978-0136820154', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-140' },
      { title: 'High Performance Linux Clusters', author: 'Joseph D. Sloan', isbn: '978-0596005702', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-141' },
      { title: 'SELinux by Example', author: 'Frank Mayer, Karl MacMillan, David Caplan', isbn: '978-0131963696', publisher: 'Prentice Hall', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-142' },
      { title: 'Container Security', author: 'Liz Rice', isbn: '978-1492056706', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-143' },
      { title: 'Kubernetes Operators', author: 'Jason Dobies, Joshua Wood', isbn: '978-1492048046', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-144' },
      { title: 'Linux Hardening in Hostile Networks', author: 'Kyle Rankin', isbn: '978-0134173290', publisher: 'Addison-Wesley', category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-145' },
      { title: 'Ansible for DevOps', author: 'Jeff Geerling', isbn: '978-0986393426', publisher: 'Leanpub', category: 'Operating Systems', quantity: 4, availableCopies: 4, shelfNumber: 'OS-146' },
      { title: 'Puppet Best Practices', author: 'Chris Barbour, Jo Rhett', isbn: '978-1491923023', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-147' },
      { title: 'Pro Bash Programming', author: 'Chris F.A. Johnson', isbn: '978-1430219989', publisher: 'Apress', category: 'Operating Systems', quantity: 3, availableCopies: 3, shelfNumber: 'OS-148' },
      { title: 'POSIX Programmer\'s Guide', author: 'Donald Lewine', isbn: '978-0937175736', publisher: "O'Reilly Media", category: 'Operating Systems', quantity: 3, availableCopies: 2, shelfNumber: 'OS-149' },
      { title: 'Embedded Linux Primer (2nd Edition)', author: 'Christopher Hallinan', isbn: '978-0137017836', publisher: 'Prentice Hall', category: 'Operating Systems', quantity: 4, availableCopies: 3, shelfNumber: 'OS-150' },

    ]);

    console.log('Seeding Sample Issued Books...');
    // Create an active issue for Alex Johnson (studentUser)
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const fourDaysLater = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

    // 1. Active issue (Due in 4 days)
    await IssuedBook.create({
      book: books[0]._id,
      student: studentUser._id,
      issueDate: tenDaysAgo,
      dueDate: fourDaysLater,
      status: 'Issued',
      remarks: 'Issued for CS Project',
    });

    // 2. Overdue issue (Due 5 days ago)
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    await IssuedBook.create({
      book: books[1]._id,
      student: studentUser._id,
      issueDate: twentyDaysAgo,
      dueDate: fiveDaysAgo,
      status: 'Issued',
      fine: 25,
      remarks: 'Overdue by 5 days',
    });

    // 3. Returned issue
    const monthAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    await IssuedBook.create({
      book: books[2]._id,
      student: student2._id,
      issueDate: monthAgo,
      dueDate: threeWeeksAgo,
      returnDate: twoWeeksAgo,
      fine: 0,
      status: 'Returned',
      remarks: 'Returned in good condition',
    });

    console.log('Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('Default Admin Account:');
    console.log('  Email:    admin@library.com');
    console.log('  Password: Admin@123');
    console.log('Default Student Account:');
    console.log('  Email:    student@library.com');
    console.log('  Password: Student@123');
    console.log('----------------------------------------------------');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
