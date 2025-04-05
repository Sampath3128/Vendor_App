import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-role-dropdown',
  templateUrl: './role-dropdown.component.html',
  styleUrls: ['./role-dropdown.component.css']
})
export class RoleDropdownComponent {
  roles: string[] = ['Organization Admin', 'Manager', 'Vendor'];
  selectedRole: string = 'Vendor';

  @Output() roleChanged = new EventEmitter<string>();

  onRoleChange() {
    this.roleChanged.emit(this.selectedRole);
  }
}
