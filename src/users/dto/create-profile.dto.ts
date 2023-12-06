export class CreateProfileDto {
  firstName: string;

  lastName: string;

  gender: string;

  dateOfBirth: string;

  passion: string[];

  getNotifications: boolean;
}
