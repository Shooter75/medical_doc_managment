﻿/**
 * @fileoverview This file defines UsersListItemComponent — component, which implements
 *     item from list of users.
 * @author andriy_katsubo@ukr.net (Andriy Katsubo)
 */
import { Component, Input } from '@angular/core';
import { Response } from '@angular/http';

import { UsersListItemActionListComponent } from './userslist-item-actionlist.component';
import UserModel from './models/usermodel'

@Component({
  selector: '[usersList-Item]',
  templateUrl: './app/views/userslist-item.component.html'
})

/**
 * Class, which implements item from list of users.
 */
export class UsersListItemComponent {
  /**
   * Property which receives data about user from users list.
   * @type {UserModel}
   */
  @Input() user: UserModel;
}

