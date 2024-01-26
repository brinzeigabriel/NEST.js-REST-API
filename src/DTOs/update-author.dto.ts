// import { PartialType } from '@nestjs/mapped-types'; //before the integration with swagger
import { PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
