import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CandidateService} from "../../services/candidate.service";
import {combineLatest, map, Observable, startWith} from "rxjs";
import {Candidate} from "../../models/candidate.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {CandidateSearchType} from "../../enums/candidate-search-type.enum";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit {

    loading$!: Observable<boolean>;
    candidates$!: Observable<Candidate[]>

    searchCtrl!: FormControl;
    searchTypeCtrl!: FormControl;
    searchTypeOptions!: {
        value: CandidateSearchType,
        label: string
    }[]
    constructor(private candidatService: CandidateService,
                private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
        this.initObservables();
        this.candidatService.getCandidateFromServer();
        this.searchTypeOptions = [
            {value: CandidateSearchType.LASTNAME, label: 'Nom'},
            {value: CandidateSearchType.FIRSTNAME, label: 'Prénom'},
            {value: CandidateSearchType.COMPANY, label: 'Entreprise'}
        ]
    }

    private initForm(){
        this.searchCtrl = this.formBuilder.control('');
        this.searchTypeCtrl = this.formBuilder.control(CandidateSearchType.LASTNAME);
    }

    private initObservables(){
        this.loading$ = this.candidatService.loading$;
        const search$: Observable<string> = this.searchCtrl.valueChanges.pipe(
            startWith(this.searchCtrl.value),
            map(value => value.toLowerCase())
        );
        const searchType$: Observable<CandidateSearchType> = this.searchTypeCtrl.valueChanges.pipe(
            startWith(this.searchTypeCtrl.value)
        );
        this.candidates$ = combineLatest([
            search$,
            searchType$,
            this.candidatService.candidates$
        ]).pipe(
            map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
                .toLowerCase()
                .includes(search)))
        );
    }
}
