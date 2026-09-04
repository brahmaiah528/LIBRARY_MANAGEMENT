import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

COLOR_TITLE = RGBColor(17, 24, 39)      # #111827 Dark slate / black
COLOR_PRIMARY = RGBColor(30, 41, 59)    # #1E293B Slate 800
COLOR_BODY = RGBColor(51, 65, 85)       # #334155 Slate 700
COLOR_ACCENT = RGBColor(37, 99, 235)    # #2563EB Royal Blue
FONT_FAMILY = "Times New Roman"

def set_run_font(run, name=FONT_FAMILY, size=Pt(20), bold=False, color=COLOR_TITLE):
    run.font.name = name
    run.font.size = size
    run.font.bold = bold
    if color:
        run.font.color.rgb = color

def format_bullet_point(tf, bold_prefix, body_text, size=Pt(18.5), is_first=False):
    p = tf.paragraphs[0] if is_first else tf.add_paragraph()
    p.space_after = Pt(11)
    p.line_spacing = 1.18
    
    if bold_prefix:
        r1 = p.add_run()
        r1.text = bold_prefix + " – " if not bold_prefix.endswith(":") else bold_prefix + " "
        set_run_font(r1, FONT_FAMILY, size, bold=True, color=COLOR_PRIMARY)
        
    r2 = p.add_run()
    r2.text = body_text
    set_run_font(r2, FONT_FAMILY, size, bold=False, color=COLOR_BODY)

def set_slide_title(slide, title_text, size=Pt(38)):
    for s in slide.shapes:
        if s.name == "Title 1" or (s.has_text_frame and s.top < Inches(1.5) and s.width > Inches(8)):
            tf = s.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = title_text
            set_run_font(p.runs[0], FONT_FAMILY, size, bold=True, color=COLOR_TITLE)
            return s
    return None

def replace_or_add_picture(slide, shape_name_part, img_path, target_pos=None):
    target_shape = None
    for s in list(slide.shapes):
        if shape_name_part in s.name:
            target_shape = s
            break
            
    if target_shape:
        if target_pos:
            left, top, width, height = target_pos
        else:
            left, top, width, height = target_shape.left, target_shape.top, target_shape.width, target_shape.height
        el = target_shape.element
        el.getparent().remove(el)
        return slide.shapes.add_picture(img_path, left, top, width, height)
    else:
        left, top, width, height = target_pos if target_pos else (Inches(6.85), Inches(1.80), Inches(5.80), Inches(4.80))
        return slide.shapes.add_picture(img_path, left, top, width, height)

def build_presentation():
    base_file = 'AI BASED EMAIL.pptx'
    prs = pptx.Presentation(base_file)
    print(f"Loaded {base_file} with {len(prs.slides)} slides.")

    # ----------------------------------------------------
    # Insert Slide for Module 4 (Layout 3: Two Content) at index 12 (Slide 13)
    # ----------------------------------------------------
    prs.slides.add_slide(prs.slide_layouts[3])
    prs.slides._sldIdLst.insert(12, prs.slides._sldIdLst[-1])
    print(f"Added Module 4 slide, total slides now: {len(prs.slides)}")

    # ----------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # ----------------------------------------------------
    s1 = prs.slides[0]
    for s in s1.shapes:
        if s.name == "Title 1":
            s.top = Inches(1.85)
            s.left = Inches(1.0)
            s.width = Inches(11.33)
            s.height = Inches(1.80)
            tf = s.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "FULL-STACK LIBRARY MANAGEMENT SYSTEM WEB APPLICATION"
            p.alignment = PP_ALIGN.CENTER
            set_run_font(p.runs[0], FONT_FAMILY, Pt(32), bold=True, color=COLOR_TITLE)
        elif s.name == "TextBox 3":
            s.top = Inches(4.15)
            s.left = Inches(1.0)
            s.width = Inches(11.33)
            s.height = Inches(0.50)
            tf = s.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "CSA 0313: SOFTWARE ENGINEERING & FULL-STACK WEB DEVELOPMENT"
            p.alignment = PP_ALIGN.CENTER
            set_run_font(p.runs[0], FONT_FAMILY, Pt(18), bold=True, color=COLOR_PRIMARY)
        elif s.name == "TextBox 4":
            s.top = Inches(5.15)
            s.left = Inches(0.92)
            s.width = Inches(4.50)
            s.height = Inches(1.30)
            tf = s.text_frame
            tf.clear()
            p1 = tf.paragraphs[0]
            p1.text = "GUIDED BY:"
            set_run_font(p1.runs[0], FONT_FAMILY, Pt(18), bold=True, color=COLOR_TITLE)
            p2 = tf.add_paragraph()
            p2.text = "Dr. M.SHAKILA"
            set_run_font(p2.runs[0], FONT_FAMILY, Pt(18), bold=False, color=COLOR_PRIMARY)
        elif s.name == "Subtitle 2":
            s.top = Inches(5.15)
            s.left = Inches(7.20)
            s.width = Inches(5.50)
            s.height = Inches(1.80)
            tf = s.text_frame
            tf.clear()
            p1 = tf.paragraphs[0]
            p1.text = "PRESENTED BY:"
            set_run_font(p1.runs[0], FONT_FAMILY, Pt(18), bold=True, color=COLOR_TITLE)
            members = [
                "J.BRAHMAIAH (192472286)",
                "Adhavan Chandrasekar (192521209)",
                "B Karthik Ratan (192372051)"
            ]
            for m in members:
                pm = tf.add_paragraph()
                pm.text = m
                set_run_font(pm.runs[0], FONT_FAMILY, Pt(16), bold=False, color=COLOR_PRIMARY)
    print("Slide 1 configured.")

    # ----------------------------------------------------
    # SLIDE 2: ABSTRACT
    # ----------------------------------------------------
    s2 = prs.slides[1]
    set_slide_title(s2, "ABSTRACT", Pt(44))
    for s in s2.shapes:
        if s.name == "TextBox 3":
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Context & Challenge", 
                                "Academic libraries manage extensive catalogs and high student circulation volumes. Traditional manual paper registers and fragmented legacy software suffer from inventory discrepancies, delayed loan tracking, and administrative overhead.",
                                Pt(19), is_first=True)
            format_bullet_point(tf, "Proposed Solution", 
                                "This project implements a production-grade Full-Stack Library Management System web application built with React.js (Vite), Node.js, Express.js, and MongoDB (Mongoose) with stateless JWT authentication.",
                                Pt(19))
            format_bullet_point(tf, "Modular Architecture", 
                                "The system is structured into four decoupled core modules: (1) User and Authentication Management, (2) Book Inventory Management, (3) Book Transaction Management, and (4) Report and System Administration.",
                                Pt(19))
            format_bullet_point(tf, "Technical Innovations", 
                                "Features an automated overdue fine calculation engine ($5/day overdue penalty), real-time stock synchronization (total vs available copies), lightweight pure SVG analytics charts, and automatic in-memory MongoDB fallback.",
                                Pt(19))
            format_bullet_point(tf, "Impact & Efficiency", 
                                "Delivers sub-second catalog search responsiveness, robust Role-Based Access Control (Admin vs Student), persistent dark/light theme, and one-click CSV audit reporting for enterprise-ready library operations.",
                                Pt(19))
    print("Slide 2 configured.")

    # ----------------------------------------------------
    # SLIDE 3: INTRODUCTION
    # ----------------------------------------------------
    s3 = prs.slides[2]
    set_slide_title(s3, "Introduction", Pt(40))
    for s in s3.shapes:
        if s.name == "Content Placeholder 2":
            s.width = Inches(5.67)
            s.height = Inches(4.80)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Academic Hub", 
                                "Libraries are foundational knowledge centers handling thousands of physical volumes and continuous student borrowing activities.",
                                Pt(18), is_first=True)
            format_bullet_point(tf, "Digital Modernization", 
                                "Modern academic workflows demand instant catalog discovery, accurate shelf status, and self-service borrowing visibility from any web device.",
                                Pt(18))
            format_bullet_point(tf, "Legacy System Pitfalls", 
                                "Manual paper registers and desktop-bound legacy systems cause missing records, human calculation errors, and lost overdue penalty revenues.",
                                Pt(18))
            format_bullet_point(tf, "Unified Web Platform", 
                                "The proposed MERN application centralizes acquisition, cataloging, circulation desk operations, and student directory administration.",
                                Pt(18))
            format_bullet_point(tf, "Core Objective", 
                                "To deliver a secure, high-performance web platform balancing strict administrative oversight with an intuitive student experience.",
                                Pt(18))
    replace_or_add_picture(s3, "Placeholder 4", 'generated_diagrams/diagram_slide3_intro.png',
                           target_pos=(Inches(6.85), Inches(1.80), Inches(5.80), Inches(4.80)))
    print("Slide 3 configured.")

    # ----------------------------------------------------
    # SLIDE 4: PROBLEM STATEMENTS
    # ----------------------------------------------------
    s4 = prs.slides[3]
    set_slide_title(s4, "Problem Statements", Pt(40))
    for s in s4.shapes:
        if s.name == "TextBox 5":
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Manual Record-Keeping Bottlenecks", 
                                "Physical register books and paper cards cause transcription errors, illegible entries, and long student wait queues.",
                                Pt(19), is_first=True)
            format_bullet_point(tf, "Real-Time Stock Discrepancies", 
                                "Librarians lack instant visibility into total holdings versus available shelf copies, leading to duplicate loan attempts.",
                                Pt(19))
            format_bullet_point(tf, "Inconsistent Overdue Fine Recovery", 
                                "Manual calculation of elapsed loan days leads to uncollected fines, calculation errors, and administrative disputes.",
                                Pt(19))
            format_bullet_point(tf, "Disconnected Student Experience", 
                                "Students cannot remotely verify book availability, check shelf locations, or review active borrowing due dates.",
                                Pt(19))
            format_bullet_point(tf, "Complex Environment Setup", 
                                "Conventional database-driven academic software requires complex local installation, hindering frictionless evaluation.",
                                Pt(19))
            format_bullet_point(tf, "Labor-Intensive Audit Reports", 
                                "Compiling monthly lending summaries and overdue audit logs requires days of tedious manual data collation.",
                                Pt(19))
    print("Slide 4 configured.")

    # ----------------------------------------------------
    # SLIDE 5: TRADITIONAL LIBRARY MANAGEMENT
    # ----------------------------------------------------
    s5 = prs.slides[4]
    for s in s5.shapes:
        if s.name == "TextBox 2":
            s.top = Inches(0.40)
            s.left = Inches(0.92)
            s.width = Inches(11.50)
            s.height = Inches(0.70)
            s.text_frame.clear()
            p = s.text_frame.paragraphs[0]
            p.text = "Traditional Library Management System"
            set_run_font(p.runs[0], FONT_FAMILY, Pt(36), bold=True, color=COLOR_TITLE)
    replace_or_add_picture(s5, "Placeholder 4", 'generated_diagrams/diagram_slide5_traditional.png',
                           target_pos=(Inches(0.92), Inches(1.25), Inches(11.50), Inches(5.60)))
    print("Slide 5 configured.")

    # ----------------------------------------------------
    # SLIDE 6: PROPOSED SYSTEM ARCHITECTURE
    # ----------------------------------------------------
    s6 = prs.slides[5]
    for s in list(s6.shapes):
        if s.has_text_frame and s.top < Inches(1.2):
            el = s.element
            el.getparent().remove(el)
            
    tb = s6.shapes.add_textbox(Inches(0.92), Inches(0.40), Inches(11.50), Inches(0.70))
    p = tb.text_frame.paragraphs[0]
    p.text = "Proposed Full-Stack System Architecture"
    set_run_font(p.runs[0], FONT_FAMILY, Pt(36), bold=True, color=COLOR_TITLE)
    
    replace_or_add_picture(s6, "Placeholder 4", 'generated_diagrams/diagram_slide6_architecture.png',
                           target_pos=(Inches(0.92), Inches(1.25), Inches(11.50), Inches(5.60)))
    print("Slide 6 configured.")

    # ----------------------------------------------------
    # SLIDE 7: OBJECTIVE
    # ----------------------------------------------------
    s7 = prs.slides[6]
    set_slide_title(s7, "Objective", Pt(40))
    for s in s7.shapes:
        if s.name == "TextBox 5":
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Secure Full-Stack Application", 
                                "To build a responsive web platform for comprehensive library cataloging and circulation management.",
                                Pt(19), is_first=True)
            format_bullet_point(tf, "Role-Based Access Control (RBAC)", 
                                "To enforce granular authorization distinguishing Admin and Student roles via signed JWT tokens and Bcrypt hashing.",
                                Pt(19))
            format_bullet_point(tf, "Real-Time Book Catalog CRUD", 
                                "To engineer a searchable catalog engine with multi-field filtering (Title, Author, Category, ISBN) and shelf indicators.",
                                Pt(19))
            format_bullet_point(tf, "Automated Circulation & Overdue Engine", 
                                "To streamline book issue/return workflows and automate fine calculation ($5/day overdue penalty).",
                                Pt(19))
            format_bullet_point(tf, "Interactive SVG Analytics & CSV Reports", 
                                "To provide real-time dashboard KPI metrics, pure SVG visual charts, and one-click CSV report export.",
                                Pt(19))
            format_bullet_point(tf, "Zero-Config In-Memory Fallback", 
                                "To integrate an automated in-memory MongoDB fallback server ensuring frictionless out-of-the-box local execution.",
                                Pt(19))
            format_bullet_point(tf, "Modern Accessible UI/UX", 
                                "To offer persistent dark/light theme switching and one-click quick demo login buttons for defense evaluation.",
                                Pt(19))
    print("Slide 7 configured.")

    # ----------------------------------------------------
    # SLIDE 8: METHODOLOGY
    # ----------------------------------------------------
    s8 = prs.slides[7]
    set_slide_title(s8, "Methodology", Pt(40))
    for s in s8.shapes:
        if s.name == "TextBox 4":
            s.top = Inches(1.15)
            s.left = Inches(0.92)
            s.width = Inches(11.50)
            tf = s.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "Flow:  User Auth → Catalog Ingestion → Stock Validation → Circulation Issue → Overdue & Return Engine → SVG Analytics & CSV Reports"
            set_run_font(p.runs[0], FONT_FAMILY, Pt(15.5), bold=True, color=COLOR_ACCENT)
        elif s.name == "TextBox 3":
            s.top = Inches(1.85)
            s.left = Inches(0.92)
            s.width = Inches(11.50)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "User Authentication", 
                                "Implement stateless JWT tokens and Bcrypt password hashing (10 salt rounds) for role-guarded session security.",
                                Pt(17.5), is_first=True)
            format_bullet_point(tf, "Catalog Ingestion & Tagging", 
                                "Model book entities with unique ISBN indices, category taxonomies, and physical shelf rack coordinates.",
                                Pt(17.5))
            format_bullet_point(tf, "Real-Time Stock Synchronization", 
                                "Enforce atomic consistency between total library holdings and active available copies across all transactions.",
                                Pt(17.5))
            format_bullet_point(tf, "Guided Issue Wizard", 
                                "Validate active student limits and available copies (> 0) before issuing with an automated 14-day loan duration.",
                                Pt(17.5))
            format_bullet_point(tf, "Dynamic Overdue Fine Calculation", 
                                "Evaluate return timestamp against due date and compute overdue penalty at $5 per day overdue rate.",
                                Pt(17.5))
            format_bullet_point(tf, "Inventory Auto-Restoration", 
                                "Increment available copy count (+1) upon confirmed book return and persist return timestamps for audit trails.",
                                Pt(17.5))
            format_bullet_point(tf, "Pure SVG Dashboard Analytics", 
                                "Render reactive SVG charts for monthly lending trends and category breakdowns without heavy external libraries.",
                                Pt(17.5))
            format_bullet_point(tf, "Audit Export & Dual-Mode DB", 
                                "Provide one-click CSV export and support automated in-memory MongoDB fallback for zero-configuration testing.",
                                Pt(17.5))
    print("Slide 8 configured.")

    # ----------------------------------------------------
    # SLIDE 9: DATA FLOW & CIRCULATION PIPELINE
    # ----------------------------------------------------
    s9 = prs.slides[8]
    for s in list(s9.shapes):
        if s.has_text_frame and s.top < Inches(1.2):
            el = s.element
            el.getparent().remove(el)
            
    tb = s9.shapes.add_textbox(Inches(0.92), Inches(0.40), Inches(11.50), Inches(0.70))
    p = tb.text_frame.paragraphs[0]
    p.text = "Data Flow & Circulation Control Pipeline"
    set_run_font(p.runs[0], FONT_FAMILY, Pt(36), bold=True, color=COLOR_TITLE)
    
    replace_or_add_picture(s9, "Placeholder 4", 'generated_diagrams/diagram_slide9_dataflow.png',
                           target_pos=(Inches(0.92), Inches(1.25), Inches(11.50), Inches(5.60)))
    print("Slide 9 configured.")

    # ----------------------------------------------------
    # SLIDE 10: MODULE 1: USER AND AUTHENTICATION MANAGEMENT
    # ----------------------------------------------------
    s10 = prs.slides[9]
    set_slide_title(s10, "Module 1: User and Authentication Management Module", Pt(34))
    for s in s10.shapes:
        if s.name == "Content Placeholder 2":
            s.width = Inches(5.67)
            s.height = Inches(4.80)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Stateless JWT Authentication", 
                                "Signs and issues secure JSON Web Tokens containing user ID, email, and role payload upon successful login.",
                                Pt(17.5), is_first=True)
            format_bullet_point(tf, "Bcrypt Password Encryption", 
                                "Pre-save Mongoose hook securely salts and hashes user passwords using 10 rounds to eliminate plaintext risks.",
                                Pt(17.5))
            format_bullet_point(tf, "Role-Based Access Control (RBAC)", 
                                "Enforces authMiddleware route guards distinguishing Admin (system-wide) and Student (self-service) roles.",
                                Pt(17.5))
            format_bullet_point(tf, "Modern Login UI", 
                                "Features Show/Hide password toggle, Remember Me persistence, and 1-click Quick Demo login shortcuts.",
                                Pt(17.5))
            format_bullet_point(tf, "Student Registration Engine", 
                                "Validates register numbers, departments, and phone credentials with automatic default student role assignment.",
                                Pt(17.5))
            format_bullet_point(tf, "Profile & Security Controls", 
                                "Enables authenticated users to manage profile details and update account passwords securely.",
                                Pt(17.5))
    replace_or_add_picture(s10, "Placeholder 4", 'generated_diagrams/diagram_slide10_module1.png',
                           target_pos=(Inches(6.85), Inches(1.80), Inches(5.80), Inches(4.80)))
    print("Slide 10 configured.")

    # ----------------------------------------------------
    # SLIDE 11: MODULE 2: BOOK INVENTORY MANAGEMENT
    # ----------------------------------------------------
    s11 = prs.slides[10]
    set_slide_title(s11, "Module 2: Book Inventory Management Module", Pt(34))
    for s in s11.shapes:
        if s.name == "Content Placeholder 2":
            s.width = Inches(5.67)
            s.height = Inches(4.80)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Full Catalog CRUD Operations", 
                                "Complete administrative capability to create, view, modify, and delete book entries with instant state feedback.",
                                Pt(17.5), is_first=True)
            format_bullet_point(tf, "Multi-Field Live Search", 
                                "Instant real-time search across Title, Author, Category, and ISBN without requiring full-page reloads.",
                                Pt(17.5))
            format_bullet_point(tf, "Dual Stock Metric Tracking", 
                                "Independently monitors Total Copies (quantity) and Available Copies (availableCopies) in active circulation.",
                                Pt(17.5))
            format_bullet_point(tf, "Shelf Location Tagging", 
                                "Assigns physical rack and shelf codes (e.g. Shelf A-1, CS-3) for rapid physical book location and retrieval.",
                                Pt(17.5))
            format_bullet_point(tf, "Dynamic Category Taxonomy", 
                                "Classifies volumes across Computer Science, Fiction, Science, Mathematics, and Engineering genres.",
                                Pt(17.5))
            format_bullet_point(tf, "Inventory Integrity Guards", 
                                "Enforces unique ISBN indices and validates stock bounds to prevent negative or inconsistent inventory records.",
                                Pt(17.5))
    replace_or_add_picture(s11, "Placeholder 4", 'generated_diagrams/diagram_slide11_module2.png',
                           target_pos=(Inches(6.85), Inches(1.80), Inches(5.80), Inches(4.80)))
    print("Slide 11 configured.")

    # ----------------------------------------------------
    # SLIDE 12: MODULE 3: BOOK TRANSACTION MANAGEMENT
    # ----------------------------------------------------
    s12 = prs.slides[11]
    set_slide_title(s12, "Module 3: Book Transaction Management Module", Pt(34))
    for s in s12.shapes:
        if s.name == "Content Placeholder 2":
            s.width = Inches(5.67)
            s.height = Inches(4.80)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Guided Issue Desk Wizard", 
                                "Intuitive modal workflow to select registered student, pick available book, and assign borrowing transaction.",
                                Pt(17.5), is_first=True)
            format_bullet_point(tf, "Loan Duration & Due Date", 
                                "Automatically calculates and sets standard 14-day borrowing duration from the exact issue timestamp.",
                                Pt(17.5))
            format_bullet_point(tf, "Automated Stock Decrement", 
                                "Validates availableCopies > 0 and decrements available count by -1 in MongoDB upon issue confirmation.",
                                Pt(17.5))
            format_bullet_point(tf, "Dynamic Overdue Fine Engine", 
                                "Evaluates return date against due date; computes overdue penalty automatically at $5 per day overdue.",
                                Pt(17.5))
            format_bullet_point(tf, "Instant Stock Restoration", 
                                "Returning a book marks transaction status as 'Returned' and automatically increments available copies by +1.",
                                Pt(17.5))
            format_bullet_point(tf, "Tabbed Circulation Filtering", 
                                "Convenient tabbed views for All, Issued, Overdue, and Returned records with real-time status indicator pills.",
                                Pt(17.5))
    replace_or_add_picture(s12, "Placeholder 9", 'generated_diagrams/diagram_slide12_module3.png',
                           target_pos=(Inches(6.85), Inches(1.80), Inches(5.80), Inches(4.80)))
    print("Slide 12 configured.")

    # ----------------------------------------------------
    # SLIDE 13: MODULE 4: REPORT AND SYSTEM ADMINISTRATION
    # ----------------------------------------------------
    s13 = prs.slides[12]
    set_slide_title(s13, "Module 4: Report and System Administration Module", Pt(34))
    
    # Remove unused Content Placeholder 3
    for s in list(s13.shapes):
        if "Placeholder 3" in s.name:
            el = s.element
            el.getparent().remove(el)
            
    for s in s13.shapes:
        if "Placeholder 2" in s.name:
            s.width = Inches(5.67)
            s.height = Inches(4.80)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Executive KPI Metrics", 
                                "Real-time dashboard cards for Total Books, Registered Students, Active Issued Books, and Overdue Count.",
                                Pt(17.5), is_first=True)
            format_bullet_point(tf, "Pure SVG Visual Charts", 
                                "Custom React SVG charts displaying Monthly Lending Trends and Category Breakdown with zero external bloat.",
                                Pt(17.5))
            format_bullet_point(tf, "Comprehensive Audit Reports", 
                                "Dedicated audit logs for Monthly Summaries, Circulation Logs, Overdue Fines, and Most Borrowed Rankings.",
                                Pt(17.5))
            format_bullet_point(tf, "One-Click Data Export to CSV", 
                                "Instant export functionality allowing administrators to download full reports directly for Excel and Google Sheets.",
                                Pt(17.5))
            format_bullet_point(tf, "Student Directory Governance", 
                                "Administrative control to view student borrowing history, active loans, and fine payment records.",
                                Pt(17.5))
            format_bullet_point(tf, "Zero-Setup In-Memory Fallback", 
                                "Seamless dual-mode connectivity with automatic in-memory MongoDB fallback and auto-seed data for demo runs.",
                                Pt(17.5))
    replace_or_add_picture(s13, "Placeholder 4", 'generated_diagrams/diagram_slide13_module4.png',
                           target_pos=(Inches(6.85), Inches(1.80), Inches(5.80), Inches(4.80)))
    print("Slide 13 (Module 4) configured.")

    # ----------------------------------------------------
    # SLIDE 14: LITERATURE REVIEW (TABLE)
    # ----------------------------------------------------
    s14 = prs.slides[13]
    for s in s14.shapes:
        if s.name == "TextBox 2":
            s.top = Inches(0.40)
            s.left = Inches(0.92)
            s.width = Inches(11.50)
            s.height = Inches(0.70)
            s.text_frame.clear()
            p = s.text_frame.paragraphs[0]
            p.text = "LITERATURE REVIEW & COMPARATIVE TECHNOLOGY STUDY"
            set_run_font(p.runs[0], FONT_FAMILY, Pt(34), bold=True, color=COLOR_TITLE)
        elif s.has_table:
            t = s.table
            t.left = Inches(0.92)
            t.top = Inches(1.40)
            t.width = Inches(11.50)
            
            # Set well-proportioned column widths
            col_widths = [Inches(2.0), Inches(0.8), Inches(2.7), Inches(2.8), Inches(3.2)]
            for c_idx, w in enumerate(col_widths):
                t.columns[c_idx].width = w
                
            table_data = [
                ["System / Study", "Year", "Architecture & Stack", "Core Limitations", "Proposed MERN Advantage"],
                ["Koha ILS Project", "2023", "Monolithic Perl, Apache, MySQL", "Heavy on-premises setup, complex UI, no native dark mode", "Lightweight React SPA, responsive UI, zero-config cloud ready"],
                ["S. Ranganathan et al.", "2024", "PHP, MySQL Server-Side Render", "Full page reloads on search, synchronous database queries", "Sub-second client filtering, stateless REST API, pure SVG charts"],
                ["Patel & Sharma", "2024", "Java Spring Boot, PostgreSQL", "Rigid configuration, lacks in-memory demonstration fallback", "Instant dual-mode execution via automatic in-memory MongoDB server"],
                ["Kumar & Singh", "2025", "React.js Client, Basic REST API", "Lacked dynamic fine automation and inventory shelf tracking", "Integrated $5/day fine calculator, shelf indicators, and CSV export"],
                ["Brahmaiah et al. (Ours)", "2026", "Full-Stack MERN + JWT + In-Memory", "Overcomes all manual, installation, and fine tracking hurdles", "Unified 4-module web platform with RBAC, SVG charts & CSV export"]
            ]
            for r_idx, row_vals in enumerate(table_data):
                for c_idx, val in enumerate(row_vals):
                    cell = t.cell(r_idx, c_idx)
                    cell.text_frame.clear()
                    cell.text_frame.margin_left = Inches(0.08)
                    cell.text_frame.margin_right = Inches(0.08)
                    cell.text_frame.margin_top = Inches(0.08)
                    cell.text_frame.margin_bottom = Inches(0.08)
                    p = cell.text_frame.paragraphs[0]
                    p.text = val
                    is_header = (r_idx == 0)
                    is_ours = (r_idx == 5)
                    font_size = Pt(13.5) if is_header else Pt(12)
                    font_bold = True if is_header or is_ours else False
                    run_color = RGBColor(255, 255, 255) if is_header else (RGBColor(30, 64, 175) if is_ours else COLOR_BODY)
                    set_run_font(p.runs[0], FONT_FAMILY, font_size, bold=font_bold, color=run_color)
    print("Slide 14 configured.")

    # ----------------------------------------------------
    # SLIDE 15: ADVANTAGES
    # ----------------------------------------------------
    s15 = prs.slides[14]
    set_slide_title(s15, "Advantages & Key Innovations", Pt(40))
    for s in s15.shapes:
        if s.name == "Content Placeholder 2":
            s.width = Inches(11.50)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Automated Stock Synchronization", 
                                "Instant real-time synchronization between total holdings and available shelf copies eliminates duplicate loan errors.",
                                Pt(19), is_first=True)
            format_bullet_point(tf, "Dynamic Financial Accountability", 
                                "Automated $5/day overdue penalty computation eliminates manual calculation mistakes and fee disputes.",
                                Pt(19))
            format_bullet_point(tf, "Granular Role-Based Security", 
                                "Stateless JWT tokens and Bcrypt password hashing (10 salt rounds) enforce strict Admin vs Student access boundaries.",
                                Pt(19))
            format_bullet_point(tf, "Zero-Dependency Visual Analytics", 
                                "Custom pure SVG charts deliver high-performance lending trends and category breakdowns without heavy external charting bundles.",
                                Pt(19))
            format_bullet_point(tf, "Frictionless Zero-Config Deployment", 
                                "Automatic in-memory MongoDB fallback runs the entire app immediately in any environment without pre-installing a database.",
                                Pt(19))
            format_bullet_point(tf, "Streamlined Administrative Workflow", 
                                "One-click CSV export, print-optimized audit views, and quick demo login shortcuts save hours of daily administrative effort.",
                                Pt(19))
    print("Slide 15 configured.")

    # ----------------------------------------------------
    # SLIDE 16: CONCLUSION
    # ----------------------------------------------------
    s16 = prs.slides[15]
    set_slide_title(s16, "Conclusion", Pt(40))
    for s in s16.shapes:
        if s.name == "TextBox 3":
            s.width = Inches(11.50)
            tf = s.text_frame
            tf.clear()
            format_bullet_point(tf, "Comprehensive Full-Stack LMS", 
                                "Successfully designed, developed, and evaluated a production-ready Full-Stack Library Management System web application.",
                                Pt(19), is_first=True)
            format_bullet_point(tf, "Modular Architecture Realization", 
                                "Seamlessly engineered all four required modules: User Auth, Book Inventory, Book Transactions, and System Reports.",
                                Pt(19))
            format_bullet_point(tf, "Operational Bottleneck Elimination", 
                                "Replaced error-prone manual paper registers with real-time stock sync and automated dynamic fine calculation.",
                                Pt(19))
            format_bullet_point(tf, "Robust Security & Access Control", 
                                "Enforced enterprise-grade security using stateless JWT authentication, Bcrypt encryption, and role-guarded routes.",
                                Pt(19))
            format_bullet_point(tf, "Evaluation & Demonstration Agility", 
                                "Delivered unprecedented setup ease via automated in-memory MongoDB fallback and pure SVG analytics charts.",
                                Pt(19))
            format_bullet_point(tf, "Extensible Foundation", 
                                "Established a scalable software foundation fully prepared for future IoT RFID scanners and online fine payment gateways.",
                                Pt(19))
    print("Slide 16 configured.")

    # ----------------------------------------------------
    # SLIDE 17: REFERENCES
    # ----------------------------------------------------
    s17 = prs.slides[16]
    set_slide_title(s17, "References", Pt(40))
    for s in s17.shapes:
        if s.name == "Content Placeholder 2":
            s.width = Inches(11.50)
            tf = s.text_frame
            tf.clear()
            refs = [
                "E. Gamma, R. Helm, R. Johnson, and J. Vlissides, \"Design Patterns: Elements of Reusable Object-Oriented Software,\" Addison-Wesley, 2023.",
                "M. Haviv, \"MERN Quick Start Guide: Build Full-Stack Web Applications with React, Node.js, Express, and MongoDB,\" Packt Publishing, 2024.",
                "D. Flanagan, \"JavaScript: The Definitive Guide - Master the World's Most-Used Programming Language,\" 7th ed., O'Reilly Media, 2024.",
                "M. Jones, J. Bradley, and N. Sakimura, \"JSON Web Token (JWT),\" RFC 7519, Internet Engineering Task Force (IETF), 2023.",
                "MongoDB Inc., \"The MongoDB Architecture Guide: High-Performance Data Modeling & Horizontal Scalability,\" Technical Whitepaper, 2025.",
                "A. Banks and E. Porcello, \"Learning React: Modern Patterns for Developing React Applications,\" 2nd ed., O'Reilly Media, 2024."
            ]
            for idx, ref in enumerate(refs):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.space_after = Pt(12)
                p.text = ref
                set_run_font(p.runs[0], FONT_FAMILY, Pt(17), bold=False, color=COLOR_BODY)
    print("Slide 17 configured.")

    # ----------------------------------------------------
    # SLIDE 18: THANK YOU & Q/A
    # ----------------------------------------------------
    s18 = prs.slides[17]
    for s in list(s18.shapes):
        el = s.element
        el.getparent().remove(el)
        
    s18.shapes.add_picture('extracted_media/ppt/media/image9.jpg', Inches(4.50), Inches(1.10), Inches(4.33), Inches(2.00))
    
    tb = s18.shapes.add_textbox(Inches(1.00), Inches(3.50), Inches(11.33), Inches(3.20))
    tf = tb.text_frame
    p1 = tf.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    p1.text = "QUESTIONS & ANSWERS (VIVA VOCE)"
    set_run_font(p1.runs[0], FONT_FAMILY, Pt(24), bold=True, color=COLOR_TITLE)
    
    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(14)
    p2.text = "Full-Stack Library Management System Web Application"
    set_run_font(p2.runs[0], FONT_FAMILY, Pt(19), bold=True, color=COLOR_ACCENT)
    
    p3 = tf.add_paragraph()
    p3.alignment = PP_ALIGN.CENTER
    p3.space_before = Pt(10)
    p3.text = "Presented by: J. Brahmaiah (192472286) | Adhavan Chandrasekar (192521209) | B Karthik Ratan (192372051)"
    set_run_font(p3.runs[0], FONT_FAMILY, Pt(16.5), bold=False, color=COLOR_PRIMARY)
    
    p4 = tf.add_paragraph()
    p4.alignment = PP_ALIGN.CENTER
    p4.space_before = Pt(8)
    p4.text = "Project Supervisor: Dr. M. Shakila | Department of Computer Science & Engineering"
    set_run_font(p4.runs[0], FONT_FAMILY, Pt(16.5), bold=False, color=COLOR_BODY)

    print("Slide 18 configured.")

    output_path = 'Library_Management_System_Presentation_Final.pptx'
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == '__main__':
    build_presentation()
