import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelLength, SortField, SortDirection, DisplayField, LocalizedLabel, LabelCodeType } from '../models/codotheque-dropdown-list.types';


@Injectable({
  providedIn: 'root'
})
export class CodothequeService {
  private apiUrl = '/api/codotheque'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  /**
   * Get labels from the Codotheque
   */
  getLabels(
    attribute: string,
    labelLength: LabelLength = LabelLength.Char25,
    sortField: SortField = SortField.None,
    sortDirection: SortDirection = SortDirection.None,
    displayField: DisplayField = DisplayField.CodeAndLabel,
    showValues: string = '',
    hideValues: string = '',
    min: string = '',
    max: string = ''
  ): Observable<LocalizedLabel[]> {
    const params = {
      attribute,
      labelLength: LabelLength[labelLength],
      sortField: SortField[sortField],
      sortDirection: SortDirection[sortDirection],
      displayField: DisplayField[displayField],
      showValues,
      hideValues,
      min,
      max
    };

    return this.http.get<any[]>(`${this.apiUrl}/labels`, { params }).pipe(
      map(response => {
        // Transform the API response to LocalizedLabel[] format
        return response.map(item => ({
          code: item.code,
          label: item.label,
          language: item.language || '',
          length: item.length !== undefined ? item.length : labelLength,
          codeType: item.codeType !== undefined ? item.codeType : LabelCodeType.Unknown,
          attributeName: attribute
        }));
      })
    );
  }

  /**
   * Get a single label from the Codotheque
   */
  getLabel(
    attribute: string,
    code: string,
    labelLength: LabelLength = LabelLength.Char25
  ): Observable<string> {
    const params = {
      attribute,
      code,
      labelLength: LabelLength[labelLength]
    };

    return this.http.get<{ label: string }>(`${this.apiUrl}/label`, { params }).pipe(
      map(response => response.label)
    );
  }
}
