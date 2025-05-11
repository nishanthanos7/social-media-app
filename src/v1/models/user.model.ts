// This file stores our users in computer memory (not a real database)
// It's like keeping a list of users on a piece of paper instead of in a proper filing cabinet
// In a real app, we would save users in a database like MongoDB or MySQL

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *           example: 1
 *         username:
 *           type: string
 *           description: The username for login
 *           example: johndoe
 *         password:
 *           type: string
 *           description: The user's password (in a real app, this would be hashed)
 *           example: password123
 *         fullName:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         profilePicture:
 *           type: string
 *           description: URL to the user's profile picture
 *           example: https://randomuser.me/api/portraits/men/1.jpg
 *         coverPhoto:
 *           type: string
 *           description: URL to the user's cover photo
 *           example: https://picsum.photos/id/1018/1200/300
 *         bio:
 *           type: string
 *           description: Short biography or status
 *           example: Software developer and hiking enthusiast
 *         location:
 *           type: string
 *           description: User's current city and country
 *           example: Seattle, WA
 *         education:
 *           type: array
 *           description: User's education history
 *           items:
 *             type: object
 *             properties:
 *               school:
 *                 type: string
 *               degree:
 *                 type: string
 *               year:
 *                 type: string
 *           example: [{"school":"University of Washington","degree":"Computer Science","year":"2015-2019"}]
 *         work:
 *           type: array
 *           description: User's work history
 *           items:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               year:
 *                 type: string
 *           example: [{"company":"Tech Corp","position":"Software Engineer","year":"2019-Present"}]
 *         friends:
 *           type: array
 *           description: List of user IDs who are friends with this user
 *           items:
 *             type: integer
 *           example: [2, 3]
 *         friendRequests:
 *           type: array
 *           description: List of pending friend request user IDs
 *           items:
 *             type: integer
 *           example: [4, 5]
 *         notifications:
 *           type: array
 *           description: User's notifications
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               type:
 *                 type: string
 *               fromUserId:
 *                 type: integer
 *               entityId:
 *                 type: integer
 *               read:
 *                 type: boolean
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *           example: [{"id":1,"type":"FRIEND_REQUEST","fromUserId":3,"entityId":null,"read":false,"createdAt":"2023-04-15T10:30:00Z"}]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user account was created
 *           example: 2023-01-15T08:30:00Z
 */
// This creates a template for what a User looks like in our app
// It's like saying "every user must have these properties"
export interface User {
  // Each user has a unique ID number
  id: number;
  // Each user has a username (like a nickname)
  username: string;
  // Each user has a password
  // In a real app, we would scramble this password for safety
  // That's called "hashing" - it turns "password123" into something like "x8j2p!9@kL"
  password: string;
  // The user's full name (like "John Smith")
  fullName?: string;
  // A link to the user's profile picture
  profilePicture?: string;
  // A link to the user's cover photo for their profile page
  coverPhoto?: string;
  // A short description about the user
  bio?: string;
  // The user's location (city, state/country)
  location?: string;
  // The user's education history
  education?: {
    school: string;
    degree: string;
    year: string;
  }[];
  // The user's work history
  work?: {
    company: string;
    position: string;
    year: string;
  }[];
  // A list of other user IDs who are friends with this user
  friends?: number[];
  // A list of user IDs who have sent friend requests to this user
  friendRequests?: number[];
  // User's notifications
  notifications?: {
    id: number;
    type: string; // e.g., 'FRIEND_REQUEST', 'POST_LIKE', 'COMMENT'
    fromUserId: number;
    entityId?: number; // e.g., post ID or comment ID
    read: boolean;
    createdAt: Date;
  }[];
  // When the user account was created
  createdAt?: Date;
}

// This creates our pretend user database with realistic-looking data
// It's just a list (array) of users that we keep in the computer's memory
// When the server restarts, this list goes back to these default users
export const users: User[] = [
  // User 1: John Doe
  {
    id: 1,
    username: 'johndoe',
    password: 'password123',
    fullName: 'John Doe',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    coverPhoto: 'https://picsum.photos/id/1018/1200/300',
    bio: 'Software developer and hiking enthusiast',
    location: 'Seattle, WA',
    education: [
      { school: 'University of Washington', degree: 'Computer Science', year: '2015-2019' }
    ],
    work: [
      { company: 'Tech Innovations', position: 'Senior Developer', year: '2019-Present' }
    ],
    friends: [2, 3, 7, 10, 15],
    friendRequests: [],
    notifications: [
      { id: 1, type: 'POST_LIKE', fromUserId: 3, entityId: 1, read: false, createdAt: new Date('2023-05-01T08:30:00Z') },
      { id: 2, type: 'COMMENT', fromUserId: 2, entityId: 1, read: true, createdAt: new Date('2023-05-01T09:15:00Z') }
    ],
    createdAt: new Date('2023-01-15T08:30:00Z')
  },
  // User 2: Jane Doe
  {
    id: 2,
    username: 'janedoe',
    password: 'password123',
    fullName: 'Jane Doe',
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    coverPhoto: 'https://picsum.photos/id/1019/1200/300',
    bio: 'Graphic designer and coffee lover',
    location: 'Portland, OR',
    education: [
      { school: 'Portland State University', degree: 'Graphic Design', year: '2016-2020' }
    ],
    work: [
      { company: 'Creative Solutions', position: 'UI/UX Designer', year: '2020-Present' }
    ],
    friends: [1, 3, 5, 8],
    friendRequests: [],
    notifications: [
      { id: 3, type: 'FRIEND_REQUEST', fromUserId: 6, entityId: null, read: false, createdAt: new Date('2023-05-02T10:30:00Z') }
    ],
    createdAt: new Date('2023-01-20T10:15:00Z')
  },
  // User 3: Mike Smith
  {
    id: 3,
    username: 'mikesmith',
    password: 'password123',
    fullName: 'Mike Smith',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    coverPhoto: 'https://picsum.photos/id/1020/1200/300',
    bio: 'Photographer and traveler',
    location: 'San Francisco, CA',
    education: [
      { school: 'Academy of Art University', degree: 'Photography', year: '2014-2018' }
    ],
    work: [
      { company: 'Freelance', position: 'Photographer', year: '2018-Present' }
    ],
    friends: [1, 2, 4, 9],
    friendRequests: [6, 11],
    notifications: [],
    createdAt: new Date('2023-02-05T14:20:00Z')
  },
  // User 4: Sarah Johnson
  {
    id: 4,
    username: 'sarahj',
    password: 'password123',
    fullName: 'Sarah Johnson',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    coverPhoto: 'https://picsum.photos/id/1021/1200/300',
    bio: 'Marketing specialist and yoga instructor',
    location: 'Los Angeles, CA',
    education: [
      { school: 'UCLA', degree: 'Marketing', year: '2015-2019' }
    ],
    work: [
      { company: 'Market Trends', position: 'Marketing Manager', year: '2019-Present' },
      { company: 'Yoga Studio', position: 'Instructor', year: '2020-Present' }
    ],
    friends: [3, 7, 12],
    friendRequests: [1, 2],
    notifications: [],
    createdAt: new Date('2023-02-10T09:45:00Z')
  },
  // User 5: David Wilson
  {
    id: 5,
    username: 'davidw',
    password: 'password123',
    fullName: 'David Wilson',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    coverPhoto: 'https://picsum.photos/id/1022/1200/300',
    bio: 'Music producer and dog lover',
    location: 'Nashville, TN',
    education: [
      { school: 'Berklee College of Music', degree: 'Music Production', year: '2013-2017' }
    ],
    work: [
      { company: 'Harmony Studios', position: 'Producer', year: '2017-Present' }
    ],
    friends: [2, 8, 14],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-03-01T16:30:00Z')
  },
  // User 6: Emily Chen
  {
    id: 6,
    username: 'emilyc',
    password: 'password123',
    fullName: 'Emily Chen',
    profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
    coverPhoto: 'https://picsum.photos/id/1023/1200/300',
    bio: 'Data scientist and amateur chef',
    location: 'Boston, MA',
    education: [
      { school: 'MIT', degree: 'Computer Science', year: '2016-2020' }
    ],
    work: [
      { company: 'Data Insights', position: 'Data Scientist', year: '2020-Present' }
    ],
    friends: [9, 11, 13],
    friendRequests: [3],
    notifications: [],
    createdAt: new Date('2023-03-05T11:20:00Z')
  },
  // User 7: Robert Johnson
  {
    id: 7,
    username: 'robertj',
    password: 'password123',
    fullName: 'Robert Johnson',
    profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    coverPhoto: 'https://picsum.photos/id/1024/1200/300',
    bio: 'Fitness trainer and nutrition coach',
    location: 'Miami, FL',
    education: [
      { school: 'University of Florida', degree: 'Exercise Science', year: '2014-2018' }
    ],
    work: [
      { company: 'FitLife Gym', position: 'Head Trainer', year: '2018-Present' }
    ],
    friends: [1, 4, 10],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-03-10T09:15:00Z')
  },
  // User 8: Olivia Martinez
  {
    id: 8,
    username: 'oliviam',
    password: 'password123',
    fullName: 'Olivia Martinez',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    coverPhoto: 'https://picsum.photos/id/1025/1200/300',
    bio: 'Travel blogger and language enthusiast',
    location: 'New York, NY',
    education: [
      { school: 'NYU', degree: 'International Relations', year: '2015-2019' }
    ],
    work: [
      { company: 'Wanderlust Blog', position: 'Founder', year: '2019-Present' }
    ],
    friends: [2, 5, 12, 15],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-03-15T14:45:00Z')
  },
  // User 9: William Taylor
  {
    id: 9,
    username: 'williamt',
    password: 'password123',
    fullName: 'William Taylor',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    coverPhoto: 'https://picsum.photos/id/1026/1200/300',
    bio: 'Software engineer and gaming enthusiast',
    location: 'Austin, TX',
    education: [
      { school: 'University of Texas', degree: 'Computer Engineering', year: '2016-2020' }
    ],
    work: [
      { company: 'GameDev Studios', position: 'Software Engineer', year: '2020-Present' }
    ],
    friends: [3, 6, 11],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-03-20T10:30:00Z')
  },
  // User 10: Sophia Lee
  {
    id: 10,
    username: 'sophial',
    password: 'password123',
    fullName: 'Sophia Lee',
    profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg',
    coverPhoto: 'https://picsum.photos/id/1027/1200/300',
    bio: 'Fashion designer and sustainability advocate',
    location: 'Chicago, IL',
    education: [
      { school: 'School of the Art Institute of Chicago', degree: 'Fashion Design', year: '2015-2019' }
    ],
    work: [
      { company: 'EcoChic', position: 'Lead Designer', year: '2019-Present' }
    ],
    friends: [1, 7, 13],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-03-25T16:20:00Z')
  },
  // User 11: James Wilson
  {
    id: 11,
    username: 'jamesw',
    password: 'password123',
    fullName: 'James Wilson',
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
    coverPhoto: 'https://picsum.photos/id/1028/1200/300',
    bio: 'Financial analyst and amateur golfer',
    location: 'Denver, CO',
    education: [
      { school: 'University of Colorado', degree: 'Finance', year: '2014-2018' }
    ],
    work: [
      { company: 'Mountain Investments', position: 'Senior Analyst', year: '2018-Present' }
    ],
    friends: [6, 9, 14],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-01T08:45:00Z')
  },
  // User 12: Ava Brown
  {
    id: 12,
    username: 'avab',
    password: 'password123',
    fullName: 'Ava Brown',
    profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg',
    coverPhoto: 'https://picsum.photos/id/1029/1200/300',
    bio: 'Elementary school teacher and children\'s book author',
    location: 'Minneapolis, MN',
    education: [
      { school: 'University of Minnesota', degree: 'Education', year: '2015-2019' }
    ],
    work: [
      { company: 'Lakeside Elementary', position: 'Teacher', year: '2019-Present' },
      { company: 'Self-published', position: 'Author', year: '2021-Present' }
    ],
    friends: [4, 8, 15],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-05T13:10:00Z')
  },
  // User 13: Ethan Davis
  {
    id: 13,
    username: 'ethand',
    password: 'password123',
    fullName: 'Ethan Davis',
    profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg',
    coverPhoto: 'https://picsum.photos/id/1030/1200/300',
    bio: 'Environmental scientist and rock climber',
    location: 'Boulder, CO',
    education: [
      { school: 'Colorado State University', degree: 'Environmental Science', year: '2016-2020' }
    ],
    work: [
      { company: 'EcoSolutions', position: 'Research Scientist', year: '2020-Present' }
    ],
    friends: [6, 10, 16],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-10T09:30:00Z')
  },
  // User 14: Isabella Garcia
  {
    id: 14,
    username: 'isabellag',
    password: 'password123',
    fullName: 'Isabella Garcia',
    profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg',
    coverPhoto: 'https://picsum.photos/id/1031/1200/300',
    bio: 'Nutritionist and marathon runner',
    location: 'San Diego, CA',
    education: [
      { school: 'UC San Diego', degree: 'Nutrition Science', year: '2015-2019' }
    ],
    work: [
      { company: 'Wellness Center', position: 'Nutritionist', year: '2019-Present' }
    ],
    friends: [5, 11, 17],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-15T15:45:00Z')
  },
  // User 15: Noah Miller
  {
    id: 15,
    username: 'noahm',
    password: 'password123',
    fullName: 'Noah Miller',
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
    coverPhoto: 'https://picsum.photos/id/1032/1200/300',
    bio: 'Architect and urban planning enthusiast',
    location: 'Philadelphia, PA',
    education: [
      { school: 'University of Pennsylvania', degree: 'Architecture', year: '2014-2018' }
    ],
    work: [
      { company: 'Urban Designs', position: 'Senior Architect', year: '2018-Present' }
    ],
    friends: [1, 8, 12, 18],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-20T11:20:00Z')
  },
  // User 16: Mia Thompson
  {
    id: 16,
    username: 'miat',
    password: 'password123',
    fullName: 'Mia Thompson',
    profilePicture: 'https://randomuser.me/api/portraits/women/8.jpg',
    coverPhoto: 'https://picsum.photos/id/1033/1200/300',
    bio: 'Veterinarian and animal welfare advocate',
    location: 'Atlanta, GA',
    education: [
      { school: 'University of Georgia', degree: 'Veterinary Medicine', year: '2013-2017' }
    ],
    work: [
      { company: 'Peachtree Animal Clinic', position: 'Veterinarian', year: '2017-Present' }
    ],
    friends: [13, 19],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-25T14:15:00Z')
  },
  // User 17: Alexander White
  {
    id: 17,
    username: 'alexw',
    password: 'password123',
    fullName: 'Alexander White',
    profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg',
    coverPhoto: 'https://picsum.photos/id/1034/1200/300',
    bio: 'Mechanical engineer and classic car enthusiast',
    location: 'Detroit, MI',
    education: [
      { school: 'Michigan Tech', degree: 'Mechanical Engineering', year: '2015-2019' }
    ],
    work: [
      { company: 'Auto Innovations', position: 'Design Engineer', year: '2019-Present' }
    ],
    friends: [14, 20],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-04-30T10:45:00Z')
  },
  // User 18: Charlotte Harris
  {
    id: 18,
    username: 'charlotteh',
    password: 'password123',
    fullName: 'Charlotte Harris',
    profilePicture: 'https://randomuser.me/api/portraits/women/9.jpg',
    coverPhoto: 'https://picsum.photos/id/1035/1200/300',
    bio: 'Pastry chef and food blogger',
    location: 'New Orleans, LA',
    education: [
      { school: 'Culinary Institute of America', degree: 'Pastry Arts', year: '2016-2018' }
    ],
    work: [
      { company: 'Sweet Delights Bakery', position: 'Head Pastry Chef', year: '2018-Present' },
      { company: 'Food & Flavor Blog', position: 'Founder', year: '2019-Present' }
    ],
    friends: [15],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-05-05T09:30:00Z')
  },
  // User 19: Benjamin Clark
  {
    id: 19,
    username: 'benjaminc',
    password: 'password123',
    fullName: 'Benjamin Clark',
    profilePicture: 'https://randomuser.me/api/portraits/men/10.jpg',
    coverPhoto: 'https://picsum.photos/id/1036/1200/300',
    bio: 'Cybersecurity specialist and privacy advocate',
    location: 'Washington, DC',
    education: [
      { school: 'Georgetown University', degree: 'Computer Security', year: '2014-2018' }
    ],
    work: [
      { company: 'SecureNet', position: 'Security Analyst', year: '2018-Present' }
    ],
    friends: [16],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-05-10T13:45:00Z')
  },
  // User 20: Amelia Lewis
  {
    id: 20,
    username: 'amelial',
    password: 'password123',
    fullName: 'Amelia Lewis',
    profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg',
    coverPhoto: 'https://picsum.photos/id/1037/1200/300',
    bio: 'Marine biologist and ocean conservation activist',
    location: 'Honolulu, HI',
    education: [
      { school: 'University of Hawaii', degree: 'Marine Biology', year: '2015-2019' }
    ],
    work: [
      { company: 'Ocean Research Institute', position: 'Marine Biologist', year: '2019-Present' },
      { company: 'Save Our Seas', position: 'Volunteer Coordinator', year: '2020-Present' }
    ],
    friends: [17],
    friendRequests: [],
    notifications: [],
    createdAt: new Date('2023-05-15T11:30:00Z')
  }
];

// This function helps us find a user by their username
// It's like looking through a phone book to find someone by their name
export const findUserByUsername = (username: string): User | undefined => {
  // This searches through our user list for a matching username
  // It returns the user if found, or undefined (nothing) if not found
  return users.find(user => user.username === username);
};

// This function helps us find a user by their ID number
// It's like looking up a student by their student ID number
export const findUserById = (id: number): User | undefined => {
  // This searches through our user list for a matching ID
  // It returns the user if found, or undefined (nothing) if not found
  return users.find(user => user.id === id);
};

// This function creates a new user and adds them to our list
// It's like filling out a form for a new student and adding them to the class
export const createUser = (username: string, password: string, fullName?: string): User => {
  // This creates a new user object with the given username and password
  const newUser: User = {
    // We give the new user an ID that's one higher than the number of users we have
    // So if we have 5 users, the new user gets ID 6
    id: users.length + 1,
    // This is the username that was passed to the function
    username,
    // This is the password that was passed to the function
    password,
    // This is the full name (if provided), or we create one based on username
    fullName: fullName || username,
    // We generate a random profile picture from randomuser.me
    // This picks either a male or female picture randomly
    profilePicture: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
    // Start with an empty bio
    bio: '',
    // Start with no friends
    friends: [],
    // Start with no friend requests
    friendRequests: [],
    // Set the creation date to now
    createdAt: new Date()
  };

  // This adds the new user to our list of users
  // It's like adding a new name to our class roster
  users.push(newUser);
  // This returns the newly created user
  return newUser;
};

// This function gets a user's friends
// It returns an array of User objects who are friends with the specified user
export const getUserFriends = (userId: number): User[] => {
  // Find the user by their ID
  const user = findUserById(userId);
  // If user not found, return empty array
  if (!user) return [];

  // Filter the users array to only include users whose IDs are in the user's friends list
  return users.filter(u => user.friends?.includes(u.id));
};

// This function sends a friend request from one user to another
export const sendFriendRequest = (fromUserId: number, toUserId: number): boolean => {
  // Find the user who will receive the request
  const toUser = findUserById(toUserId);
  // If that user doesn't exist, return false (failed)
  if (!toUser) return false;

  // Make sure the users aren't already friends and there's no pending request
  if (toUser.friends?.includes(fromUserId) || toUser.friendRequests?.includes(fromUserId)) {
    return false;
  }

  // Initialize friendRequests array if it doesn't exist
  if (!toUser.friendRequests) {
    toUser.friendRequests = [];
  }

  // Add the requesting user's ID to the recipient's friend requests
  toUser.friendRequests.push(fromUserId);
  return true;
};

// This function accepts a friend request
export const acceptFriendRequest = (userId: number, friendId: number): boolean => {
  // Find both users
  const user = findUserById(userId);
  const friend = findUserById(friendId);

  // If either user doesn't exist, return false (failed)
  if (!user || !friend) return false;

  // Make sure there's a pending request
  if (!user.friendRequests) return false;
  const requestIndex = user.friendRequests.indexOf(friendId);
  if (requestIndex === -1) return false;

  // Initialize friends arrays if they don't exist
  if (!user.friends) user.friends = [];
  if (!friend.friends) friend.friends = [];

  // Remove from requests and add to friends (for both users)
  user.friendRequests.splice(requestIndex, 1);
  user.friends.push(friendId);
  friend.friends.push(userId);

  return true;
};

// This function returns public user data (excludes sensitive information)
export const getPublicUserData = (user: User) => {
  // Use destructuring to exclude password and friendRequests
  // The rest of the properties go into publicData
  const { password, friendRequests, ...publicData } = user;
  return publicData;
};
