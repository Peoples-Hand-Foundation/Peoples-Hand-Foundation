import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const app = express();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      Date.now() +
      '-' +
      Math.random().toString(36).substring(2, 10) +
      ext;

    cb(null, filename);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

app.use('/uploads', express.static(uploadDir));
app.use(cors());
app.use(express.json());

const db = new Database('foundation.db');

db.pragma('journal_mode=WAL');


/* =========================================================
   DATABASE TABLES
========================================================= */

db.exec(`
  /* =========================
     IMPACT
  ========================= */

  CREATE TABLE IF NOT EXISTS impact(
    id INTEGER PRIMARY KEY CHECK(id=1),
    people_supported INTEGER,
    meals_distributed INTEGER,
    students_supported INTEGER,
    medical_camps INTEGER,
    volunteers INTEGER,
    social_activities INTEGER
  );


  /* =========================
     FORM SUBMISSIONS
  ========================= */

  CREATE TABLE IF NOT EXISTS submissions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    data TEXT,
    created_at TEXT
  );


  /* =========================
     ACTIVITIES
  ========================= */

  CREATE TABLE IF NOT EXISTS activities(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );


  /* =========================
     EVENTS
  ========================= */

  CREATE TABLE IF NOT EXISTS events(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT,
    time TEXT,
    location TEXT,
    description TEXT,
    beneficiaries TEXT,
    media TEXT,
    status TEXT DEFAULT 'upcoming',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );


  /* =========================
     TEAM
  ========================= */

  CREATE TABLE IF NOT EXISTS team(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    image TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );


  /* =========================
     GALLERY
  ========================= */

  CREATE TABLE IF NOT EXISTS gallery(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    type TEXT DEFAULT 'image',
    media_url TEXT NOT NULL,
    event_date TEXT,
    location TEXT,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);


/* =========================================================
   DEFAULT IMPACT
========================================================= */

const exists =
  db.prepare(
    'SELECT id FROM impact WHERE id=1'
  ).get();

if (!exists) {

  db.prepare(`
    INSERT INTO impact
    VALUES(
      1,
      50,
      200,
      20,
      1,
      12,
      9
    )
  `).run();

}


/* =========================================================
   DEFAULT ACTIVITIES
========================================================= */

const activityCount =
  db.prepare(
    'SELECT COUNT(*) AS count FROM activities'
  ).get();

if (activityCount.count === 0) {

  const insert =
    db.prepare(`
      INSERT INTO activities
      (title, icon, description)
      VALUES (?, ?, ?)
    `);

  const activities = [

    [
      'Food Distribution',
      'Utensils',
      'Distribute nutritious meals and food items to people and communities who need support.'
    ],

    [
      'Clothing Distribution',
      'HandHeart',
      'Provide clothes and essential clothing items to people and families in need.'
    ],

    [
      'Education Support',
      'GraduationCap',
      'Support students with books, stationery, school supplies and educational resources.'
    ],

    [
      'Healthcare Support',
      'Stethoscope',
      'Support communities through healthcare initiatives and medical camps.'
    ],

    [
      'Medical Camps',
      'Stethoscope',
      'Organize checkups, healthcare awareness and basic medical support.'
    ],

    [
      'Essential Items',
      'HandHeart',
      'Distribute essential household and daily-use items to people who need support.'
    ]

  ];

  const insertMany =
    db.transaction((items) => {

      for (const item of items) {
        insert.run(...item);
      }

    });

  insertMany(activities);

}


/* =========================================================
   JWT
========================================================= */

const SECRET =
  process.env.JWT_SECRET ||
  'change-this-secret-before-production';


function verifyAdmin(req, res, next) {

  try {

    const token =
      (
        req.headers.authorization ||
        ''
      ).replace(
        'Bearer ',
        ''
      );

    if (!token) {

      return res.status(401).json({
        message: 'Unauthorized'
      });

    }

    const decoded =
      jwt.verify(
        token,
        SECRET
      );

    if (decoded.role !== 'admin') {

      return res.status(403).json({
        message: 'Forbidden'
      });

    }

    req.admin = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: 'Unauthorized'
    });

  }
}


/* =========================================================
   HEALTH
========================================================= */

app.get(
  '/api/health',
  (req, res) => {

    res.json({
      ok: true,
      message: 'People’s Hand API is running'
    });

  }
);


/* =========================================================
   IMPACT
========================================================= */


/* GET IMPACT */

app.get(
  '/api/impact',
  (req, res) => {

    const impact =
      db
        .prepare(
          'SELECT * FROM impact WHERE id=1'
        )
        .get();

    res.json(impact);

  }
);


/* UPDATE IMPACT */

app.put(
  '/api/impact',
  verifyAdmin,
  (req, res) => {

    const x = req.body;

    db.prepare(`
      UPDATE impact
      SET
        people_supported=?,
        meals_distributed=?,
        students_supported=?,
        medical_camps=?,
        volunteers=?,
        social_activities=?
      WHERE id=1
    `).run(
      Number(x.people_supported),
      Number(x.meals_distributed),
      Number(x.students_supported),
      Number(x.medical_camps),
      Number(x.volunteers),
      Number(x.social_activities)
    );

    const updated =
      db
        .prepare(
          'SELECT * FROM impact WHERE id=1'
        )
        .get();

    res.json(updated);

  }
);


/* =========================================================
   ACTIVITIES
========================================================= */


/* GET ALL ACTIVITIES */

app.get(
  '/api/activities',
  (req, res) => {

    const activities =
      db.prepare(`
        SELECT *
        FROM activities
        ORDER BY id ASC
      `).all();

    res.json(activities);

  }
);


/* GET SINGLE ACTIVITY */

app.get(
  '/api/activities/:id',
  (req, res) => {

    const activity =
      db.prepare(`
        SELECT *
        FROM activities
        WHERE id=?
      `).get(
        Number(req.params.id)
      );

    if (!activity) {

      return res.status(404).json({
        message: 'Activity not found'
      });

    }

    res.json(activity);

  }
);


/* CREATE ACTIVITY */

app.post(
  '/api/activities',
  verifyAdmin,
  (req, res) => {

    const {
      title,
      icon,
      description
    } = req.body;

    if (!title || !description) {

      return res.status(400).json({
        message:
          'Title and description are required'
      });

    }

    const result =
      db.prepare(`
        INSERT INTO activities
        (title, icon, description)
        VALUES (?, ?, ?)
      `).run(
        title,
        icon || 'HandHeart',
        description
      );

    const activity =
      db.prepare(`
        SELECT *
        FROM activities
        WHERE id=?
      `).get(
        result.lastInsertRowid
      );

    res.status(201).json(activity);

  }
);


/* UPDATE ACTIVITY */

app.put(
  '/api/activities/:id',
  verifyAdmin,
  (req, res) => {

    const {
      title,
      icon,
      description
    } = req.body;

    const id =
      Number(req.params.id);

    const existing =
      db.prepare(`
        SELECT *
        FROM activities
        WHERE id=?
      `).get(id);

    if (!existing) {

      return res.status(404).json({
        message: 'Activity not found'
      });

    }

    db.prepare(`
      UPDATE activities
      SET
        title=?,
        icon=?,
        description=?
      WHERE id=?
    `).run(
      title,
      icon || 'HandHeart',
      description,
      id
    );

    const updated =
      db.prepare(`
        SELECT *
        FROM activities
        WHERE id=?
      `).get(id);

    res.json(updated);

  }
);


/* DELETE ACTIVITY */

app.delete(
  '/api/activities/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const result =
      db.prepare(`
        DELETE FROM activities
        WHERE id=?
      `).run(id);

    if (result.changes === 0) {

      return res.status(404).json({
        message: 'Activity not found'
      });

    }

    res.json({
      success: true
    });

  }
);


/* =========================================================
   EVENTS
========================================================= */


/* GET ALL EVENTS */

app.get(
  '/api/events',
  (req, res) => {

    const events =
      db.prepare(`
        SELECT *
        FROM events
        ORDER BY date ASC, id DESC
      `).all();

    res.json(events);

  }
);


/* GET SINGLE EVENT */

app.get(
  '/api/events/:id',
  (req, res) => {

    const event =
      db.prepare(`
        SELECT *
        FROM events
        WHERE id=?
      `).get(
        Number(req.params.id)
      );

    if (!event) {

      return res.status(404).json({
        message: 'Event not found'
      });

    }

    res.json(event);

  }
);


/* CREATE EVENT */

app.post(
  '/api/events',
  verifyAdmin,
  (req, res) => {

    const {
      title,
      date,
      time,
      location,
      description,
      beneficiaries,
      media,
      status
    } = req.body;

    if (!title) {

      return res.status(400).json({
        message: 'Event title is required'
      });

    }

    const result =
      db.prepare(`
        INSERT INTO events
        (
          title,
          date,
          time,
          location,
          description,
          beneficiaries,
          media,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        title,
        date || '',
        time || '',
        location || '',
        description || '',
        beneficiaries || '',
        media || '',
        status || 'upcoming'
      );

    const event =
      db.prepare(`
        SELECT *
        FROM events
        WHERE id=?
      `).get(
        result.lastInsertRowid
      );

    res.status(201).json(event);

  }
);


/* UPDATE EVENT */

app.put(
  '/api/events/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const existing =
      db.prepare(`
        SELECT *
        FROM events
        WHERE id=?
      `).get(id);

    if (!existing) {

      return res.status(404).json({
        message: 'Event not found'
      });

    }

    const {
      title,
      date,
      time,
      location,
      description,
      beneficiaries,
      media,
      status
    } = req.body;

    if (!title) {

      return res.status(400).json({
        message: 'Event title is required'
      });

    }

    db.prepare(`
      UPDATE events
      SET
        title=?,
        date=?,
        time=?,
        location=?,
        description=?,
        beneficiaries=?,
        media=?,
        status=?
      WHERE id=?
    `).run(
      title,
      date || '',
      time || '',
      location || '',
      description || '',
      beneficiaries || '',
      media || '',
      status || 'upcoming',
      id
    );

    const updated =
      db.prepare(`
        SELECT *
        FROM events
        WHERE id=?
      `).get(id);

    res.json(updated);

  }
);


/* DELETE EVENT */

app.delete(
  '/api/events/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const result =
      db.prepare(`
        DELETE FROM events
        WHERE id=?
      `).run(id);

    if (result.changes === 0) {

      return res.status(404).json({
        message: 'Event not found'
      });

    }

    res.json({
      success: true
    });

  }
);


/* =========================================================
   TEAM
========================================================= */


/* GET ALL TEAM MEMBERS */

app.get(
  '/api/team',
  (req, res) => {

    const team =
      db.prepare(`
        SELECT *
        FROM team
        ORDER BY display_order ASC, id ASC
      `).all();

    res.json(team);

  }
);


/* GET SINGLE TEAM MEMBER */

app.get(
  '/api/team/:id',
  (req, res) => {

    const member =
      db.prepare(`
        SELECT *
        FROM team
        WHERE id=?
      `).get(
        Number(req.params.id)
      );

    if (!member) {

      return res.status(404).json({
        message: 'Team member not found'
      });

    }

    res.json(member);

  }
);


/* CREATE TEAM MEMBER */

app.post(
  '/api/team',
  verifyAdmin,
  (req, res) => {

    const {
      name,
      role,
      bio,
      image,
      display_order
    } = req.body;

    if (!name) {

      return res.status(400).json({
        message: 'Team member name is required'
      });

    }

    const result =
      db.prepare(`
        INSERT INTO team
        (
          name,
          role,
          bio,
          image,
          display_order
        )
        VALUES (?, ?, ?, ?, ?)
      `).run(
        name,
        role || '',
        bio || '',
        image || '',
        Number(display_order) || 0
      );

    const member =
      db.prepare(`
        SELECT *
        FROM team
        WHERE id=?
      `).get(
        result.lastInsertRowid
      );

    res.status(201).json(member);

  }
);


/* UPDATE TEAM MEMBER */

app.put(
  '/api/team/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const existing =
      db.prepare(`
        SELECT *
        FROM team
        WHERE id=?
      `).get(id);

    if (!existing) {

      return res.status(404).json({
        message: 'Team member not found'
      });

    }

    const {
      name,
      role,
      bio,
      image,
      display_order
    } = req.body;

    if (!name) {

      return res.status(400).json({
        message: 'Team member name is required'
      });

    }

    db.prepare(`
      UPDATE team
      SET
        name=?,
        role=?,
        bio=?,
        image=?,
        display_order=?
      WHERE id=?
    `).run(
      name,
      role || '',
      bio || '',
      image || '',
      Number(display_order) || 0,
      id
    );

    const updated =
      db.prepare(`
        SELECT *
        FROM team
        WHERE id=?
      `).get(id);

    res.json(updated);

  }
);


/* DELETE TEAM MEMBER */

app.delete(
  '/api/team/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const result =
      db.prepare(`
        DELETE FROM team
        WHERE id=?
      `).run(id);

    if (result.changes === 0) {

      return res.status(404).json({
        message: 'Team member not found'
      });

    }

    res.json({
      success: true
    });

  }
);


/* =========================================================
   GALLERY
========================================================= */


/* GET ALL GALLERY ITEMS */

app.get(
  '/api/gallery',
  (req, res) => {

    const gallery =
      db.prepare(`
        SELECT *
        FROM gallery
        ORDER BY id DESC
      `).all();

    res.json(gallery);

  }
);


/* GET SINGLE GALLERY ITEM */

app.get(
  '/api/gallery/:id',
  (req, res) => {

    const item =
      db.prepare(`
        SELECT *
        FROM gallery
        WHERE id=?
      `).get(
        Number(req.params.id)
      );

    if (!item) {

      return res.status(404).json({
        message: 'Gallery item not found'
      });

    }

    res.json(item);

  }
);

/* UPLOAD GALLERY FILE */

app.post(
  '/api/gallery/upload',
  verifyAdmin,
  upload.single('file'),
  (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      const fileUrl =
        `http://localhost:${PORT}/uploads/${req.file.filename}`;

      res.status(201).json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,

        type:
          req.file.mimetype.startsWith('video/')
            ? 'video'
            : 'image'
      });

    } catch (error) {

      console.error(
        'Gallery upload error:',
        error
      );

      res.status(500).json({
        message: 'Failed to upload file'
      });

    }
  }
);
/* CREATE GALLERY ITEM */

app.post(
  '/api/gallery',
  verifyAdmin,
  (req, res) => {

    const {
      title,
      category,
      type,
      media_url,
      event_date,
      location,
      description
    } = req.body;

    if (!media_url) {

      return res.status(400).json({
        message:
          'Media URL is required'
      });

    }

    const allowedTypes = [
      'image',
      'video'
    ];

    const mediaType =
      allowedTypes.includes(type)
        ? type
        : 'image';

    const result =
      db.prepare(`
        INSERT INTO gallery
        (
          title,
          category,
          type,
          media_url,
          event_date,
          location,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        title,
        category || '',
        mediaType,
        media_url,
        event_date || '',
        location || '',
        description || ''
      );

    const item =
      db.prepare(`
        SELECT *
        FROM gallery
        WHERE id=?
      `).get(
        result.lastInsertRowid
      );

    res.status(201).json(item);

  }
);


/* UPDATE GALLERY ITEM */

app.put(
  '/api/gallery/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const existing =
      db.prepare(`
        SELECT *
        FROM gallery
        WHERE id=?
      `).get(id);

    if (!existing) {

      return res.status(404).json({
        message: 'Gallery item not found'
      });

    }

    const {
      title,
      category,
      type,
      media_url,
      event_date,
      location,
      description
    } = req.body;

    if (!media_url) {

      return res.status(400).json({
        message:
          'Media URL is required'
      });

    }

    const allowedTypes = [
      'image',
      'video'
    ];

    const mediaType =
      allowedTypes.includes(type)
        ? type
        : 'image';

    db.prepare(`
      UPDATE gallery
      SET
        title=?,
        category=?,
        type=?,
        media_url=?,
        event_date=?,
        location=?,
        description=?
      WHERE id=?
    `).run(
      title,
      category || '',
      mediaType,
      media_url,
      event_date || '',
      location || '',
      description || '',
      id
    );

    const updated =
      db.prepare(`
        SELECT *
        FROM gallery
        WHERE id=?
      `).get(id);

    res.json(updated);

  }
);


/* DELETE GALLERY ITEM */

app.delete(
  '/api/gallery/:id',
  verifyAdmin,
  (req, res) => {

    const id =
      Number(req.params.id);

    const result =
      db.prepare(`
        DELETE FROM gallery
        WHERE id=?
      `).run(id);

    if (result.changes === 0) {

      return res.status(404).json({
        message: 'Gallery item not found'
      });

    }

    res.json({
      success: true
    });

  }
);


/* =========================================================
   FORM SUBMISSIONS
========================================================= */

for (
  const [
    route,
    type
  ] of [
    ['volunteers', 'volunteer'],
    ['celebrations', 'celebration'],
    ['messages', 'message'],
    ['donations', 'donation']
  ]
) {

  app.post(
    '/api/' + route,
    async (req, res) => {

      try {

        db.prepare(`
          INSERT INTO submissions
          (type, data, created_at)
          VALUES (?, ?, datetime('now'))
        `).run(
          type,
          JSON.stringify(req.body)
        );

        /* SEND EMAIL ONLY FOR VOLUNTEERS AND DONATIONS */

        if (
          type === 'volunteer' ||
          type === 'donation'
        ) {

          const subject =
            type === 'volunteer'
              ? "New Volunteer Registration - People's Hand Foundation"
              : "New Donation Submission - People's Hand Foundation";

          const emailBody = `
${type === 'volunteer' ? 'New Volunteer Registration' : 'New Donation Submission'}

${Object.entries(req.body)
  .map(([key, value]) => `${key}: ${value ?? ''}`)
  .join('\n')}

Submitted from People's Hand Foundation website.
`;

          try {

            await emailTransporter.sendMail({
              from: process.env.EMAIL_USER,
              to: 'vinaykonda055@gmail.com',
              subject: subject,
              text: emailBody
            });

            console.log(
              `${type} email sent successfully`
            );

          } catch (emailError) {

            console.error(
              `${type} email failed:`,
              emailError
            );

          }

        }

        res.status(201).json({
          success: true
        });

      } catch (error) {

        console.error(
          `Error saving ${type}:`,
          error
        );

        res.status(500).json({
          message:
            'Failed to save submission'
        });

      }

    }
  );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

app.post(
  '/api/admin/login',
  (req, res) => {

    const {
      email,
      password
    } = req.body;

    const ADMIN_EMAIL =
      process.env.ADMIN_EMAIL;

    const ADMIN_PASSWORD =
      process.env.ADMIN_PASSWORD;

    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {

      return res.json({
        token: jwt.sign(
          {
            role: 'admin'
          },
          SECRET,
          {
            expiresIn: '8h'
          }
        )
      });

    }

    res.status(401).json({
      message:
        'Invalid credentials'
    });

  }
);

/* =========================================================
   ADMIN VERIFY
========================================================= */

app.get(
  '/api/admin/verify',
  verifyAdmin,
  (req, res) => {

    res.json({
      authenticated: true,
      role: req.admin.role
    });

  }
);


/* =========================================================
   ADMIN SUBMISSIONS
========================================================= */

app.get(
  '/api/admin/submissions',
  verifyAdmin,
  (req, res) => {

    try {

      const submissions =
        db
          .prepare(`
            SELECT *
            FROM submissions
            ORDER BY id DESC
          `)
          .all()
          .map((item) => {

            let parsedData = {};

            try {
              parsedData =
                JSON.parse(item.data);
            } catch {
              parsedData = {};
            }

            return {
              ...item,
              data: parsedData
            };

          });

      return res.json(
        submissions
      );

    } catch (error) {

      console.error(
        'Admin submissions error:',
        error
      );

      return res.status(500).json({
        message:
          'Failed to load submissions'
      });

    }

  }
);


/* =========================================================
   SERVER
========================================================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `People’s Hand API running on port ${PORT}`
    );

  }
);
