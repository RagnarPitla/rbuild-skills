# AXTR Reader — Example

## Scenario: Converting an AP Invoice Approval .axtr File into UAT Test Scripts

**Who:** Claire Hutchins, D365 Functional Consultant, mid-size Microsoft partner
**Where:** UAT phase of a D365 F&O go-live for a manufacturing client; the AP team recorded their current invoice approval process using Task Recorder 3 months ago during process workshops
**The Problem:** The client has 14 .axtr files from their process workshops. The UAT team needs test scripts from these files — step-by-step instructions, expected results, and test data requirements — but no one has time to manually walk through each recording and write them up. The go-live is 3 weeks out. The AP invoice approval recording has 47 steps and covers 3 variants of the approval workflow.

**Prerequisites:** .axtr file from Task Recorder; D365 F&O test environment available for UAT.

---

### What You Say to the Agent

> "I have an .axtr file from our client's AP invoice approval process. 47 steps, 3 workflow variants. I need UAT test scripts from this — step-by-step instructions, expected results, and what test data the testers will need. The go-live is 3 weeks out and I don't have time to write these manually."

### What the Agent Does

1. Parses the .axtr file (ZIP archive containing XML): extracts all recorded steps with their action types (click, input, navigate), field names, form paths, and the values entered during the recording session

2. Identifies the 3 workflow variants embedded in the 47 steps: standard 2-way approval (invoice under $10,000, single approver), escalated 3-way approval (invoice $10,000-$50,000, requires department manager + CFO), and exception path (invoice with PO mismatch, routes to AP supervisor queue)

3. Generates UAT test scripts for each variant in a structured table format: Step number, Navigation path, Action, Field name, Test data to enter, Expected result, Pass/Fail checkbox — formatted as a Word document the testers can print or fill in on screen

4. Produces the test data requirements sheet: vendor accounts needed (1 active vendor per approval tier), invoice amounts per test case, purchase orders to reference (variant 1 needs a matched PO, variant 3 needs a deliberately mismatched PO to trigger the exception path), and the user roles required in test environment (AP Clerk, Department Manager, CFO, AP Supervisor)

5. Flags 4 steps in the recording where the consultant entered data that will not exist in the test environment (specific vendor account numbers and PO numbers from the production recording), and marks them with "REPLACE WITH TEST DATA" callouts in the script

### The Business Impact

- **14 test scripts produced in one day** instead of 3 weeks of manual write-up
- **3 workflow variants correctly identified** and documented separately — testers don't accidentally follow the wrong path for their scenario
- **Test data requirements handed to the data team** before UAT week, not discovered on day one
- **Go-live stays on schedule** — UAT starts with complete, usable scripts rather than consultants improvising from the recordings

### Try It Yourself

> "I have an .axtr file from our client's month-end bank reconciliation process. They use D365 cash and bank management. I need to understand what the process looks like step-by-step and identify any manual workarounds the user was doing during the recording."
