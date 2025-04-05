import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.css']
})
export class DocListComponent {
  complianceDocs = [
    { name: 'W9 Form', status: 'Pending', uploadedDate: '2024-04-03' },
    { name: 'Business License', status: 'Verified', uploadedDate: '2024-04-01' },
    { name: 'Vendor Agreement', status: 'Rejected', uploadedDate: '2024-04-02' }
  ];

  verifyDoc(doc: any) {
    doc.status = 'Verified';
    console.log(`${doc.name} marked as Verified.`);
  }

  rejectDoc(doc: any) {
    doc.status = 'Rejected';
    console.log(`${doc.name} marked as Rejected.`);
  }
}
